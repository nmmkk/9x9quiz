import { useEffect, useMemo, useState } from "react";
import { drawNextFact } from "../domain/draw";
import { createFactPool, isAnswerCorrect, type QuizFact } from "../domain/facts";
import { type PracticeScope } from "../domain/practiceScope";
import { applyAnswerScore } from "../domain/scoring";

type IncorrectAnswerReveal = {
  submittedAnswer: number;
  correctAnswer: number;
};

type TableProgress = {
  answered: number;
  correct: number;
};

type SessionTableStat = {
  table: number;
  answered: number;
  correct: number;
};

type SessionState = {
  totalQuestions: number;
  answeredQuestions: number;
  currentFact: QuizFact;
  inputValue: string;
  correctCount: number;
  score: number;
  tableProgressByTable: Map<number, TableProgress>;
  missedFactKeys: Set<string>;
  incorrectAnswerReveal: IncorrectAnswerReveal | null;
  isComplete: boolean;
};

type UseQuizSessionOptions = {
  questionCount: number;
  practiceScope?: PracticeScope;
  reviewFactKeys?: readonly string[];
  random?: () => number;
};

type UseQuizSessionResult = {
  totalQuestions: number;
  answeredQuestions: number;
  currentQuestionNumber: number;
  currentFact: QuizFact;
  inputValue: string;
  correctCount: number;
  score: number;
  isComplete: boolean;
  tableStats: readonly SessionTableStat[];
  missedFactKeys: readonly string[];
  incorrectAnswerReveal: IncorrectAnswerReveal | null;
  appendDigit: (digit: string) => void;
  clearInput: () => void;
  backspaceInput: () => void;
  submitAnswer: () => void;
  proceedAfterIncorrectAnswer: () => void;
};

function createSessionFactPool(
  practiceScope: PracticeScope | undefined,
  reviewFactKeys: readonly string[] | undefined,
): QuizFact[] {
  const scopedFactPool = createFactPool({ practiceScope });

  if (!reviewFactKeys) {
    return scopedFactPool;
  }

  const reviewKeySet = new Set(reviewFactKeys);
  const reviewFactPool = scopedFactPool.filter((fact) => reviewKeySet.has(fact.key));

  return reviewFactPool.length > 0 ? reviewFactPool : scopedFactPool;
}

function recordTableOutcome(
  currentProgressByTable: ReadonlyMap<number, TableProgress>,
  table: number,
  isCorrect: boolean,
): Map<number, TableProgress> {
  const nextProgressByTable = new Map(currentProgressByTable);
  const currentProgress = nextProgressByTable.get(table) ?? {
    answered: 0,
    correct: 0,
  };

  nextProgressByTable.set(table, {
    answered: currentProgress.answered + 1,
    correct: currentProgress.correct + (isCorrect ? 1 : 0),
  });

  return nextProgressByTable;
}

function toSortedTableStats(tableProgressByTable: ReadonlyMap<number, TableProgress>): SessionTableStat[] {
  return Array.from(tableProgressByTable.entries())
    .sort(([leftTable], [rightTable]) => leftTable - rightTable)
    .map(([table, progress]) => ({
      table,
      answered: progress.answered,
      correct: progress.correct,
    }));
}

function createInitialState(
  totalQuestions: number,
  factPool: readonly QuizFact[],
  random: () => number,
): SessionState {
  return {
    totalQuestions,
    answeredQuestions: 0,
    currentFact: drawNextFact({ facts: factPool, random }),
    inputValue: "",
    correctCount: 0,
    score: 0,
    tableProgressByTable: new Map(),
    missedFactKeys: new Set(),
    incorrectAnswerReveal: null,
    isComplete: false,
  };
}

function drawFollowingFact(
  factPool: readonly QuizFact[],
  missedFactKeys: ReadonlySet<string>,
  previousFactKey: string,
  random: () => number,
): QuizFact {
  return drawNextFact({
    facts: factPool,
    missedFactKeys,
    previousFactKey,
    random,
  });
}

export function useQuizSession({
  questionCount,
  practiceScope,
  reviewFactKeys,
  random = Math.random,
}: UseQuizSessionOptions): UseQuizSessionResult {
  const factPool = useMemo(
    () => createSessionFactPool(practiceScope, reviewFactKeys),
    [practiceScope, reviewFactKeys],
  );
  const requestedQuestionCount = Math.max(1, questionCount);
  const totalQuestions = reviewFactKeys
    ? Math.min(requestedQuestionCount, factPool.length)
    : requestedQuestionCount;
  const [state, setState] = useState<SessionState>(() => createInitialState(totalQuestions, factPool, random));

  useEffect(() => {
    setState(createInitialState(totalQuestions, factPool, random));
  }, [factPool, random, totalQuestions]);

  const appendDigit = (digit: string) => {
    if (!/^\d$/.test(digit)) {
      return;
    }

    setState((currentState) => {
      if (currentState.isComplete || currentState.incorrectAnswerReveal || currentState.inputValue.length >= 2) {
        return currentState;
      }

      return {
        ...currentState,
        inputValue: `${currentState.inputValue}${digit}`,
      };
    });
  };

  const clearInput = () => {
    setState((currentState) => {
      if (currentState.isComplete || currentState.incorrectAnswerReveal || currentState.inputValue.length === 0) {
        return currentState;
      }

      return {
        ...currentState,
        inputValue: "",
      };
    });
  };

  const backspaceInput = () => {
    setState((currentState) => {
      if (currentState.isComplete || currentState.incorrectAnswerReveal || currentState.inputValue.length === 0) {
        return currentState;
      }

      return {
        ...currentState,
        inputValue: currentState.inputValue.slice(0, -1),
      };
    });
  };

  const submitAnswer = () => {
    setState((currentState) => {
      if (
        currentState.isComplete ||
        currentState.incorrectAnswerReveal ||
        currentState.inputValue.length === 0
      ) {
        return currentState;
      }

      const submittedAnswer = Number.parseInt(currentState.inputValue, 10);
      if (Number.isNaN(submittedAnswer)) {
        return currentState;
      }

      if (isAnswerCorrect(currentState.currentFact, submittedAnswer)) {
        const answeredQuestions = currentState.answeredQuestions + 1;
        const score = applyAnswerScore(currentState.score, true);
        const correctCount = currentState.correctCount + 1;
        const tableProgressByTable = recordTableOutcome(
          currentState.tableProgressByTable,
          currentState.currentFact.left,
          true,
        );
        if (answeredQuestions >= currentState.totalQuestions) {
          return {
            ...currentState,
            answeredQuestions,
            score,
            correctCount,
            tableProgressByTable,
            inputValue: "",
            isComplete: true,
          };
        }

        const nextFact = drawFollowingFact(
          factPool,
          currentState.missedFactKeys,
          currentState.currentFact.key,
          random,
        );

        return {
          ...currentState,
          answeredQuestions,
          currentFact: nextFact,
          inputValue: "",
          correctCount,
          score,
          tableProgressByTable,
        };
      }

      const missedFactKeys = new Set(currentState.missedFactKeys);
      missedFactKeys.add(currentState.currentFact.key);

      return {
        ...currentState,
        inputValue: "",
        missedFactKeys,
        incorrectAnswerReveal: {
          submittedAnswer,
          correctAnswer: currentState.currentFact.answer,
        },
      };
    });
  };

  const proceedAfterIncorrectAnswer = () => {
    setState((currentState) => {
      if (currentState.isComplete || !currentState.incorrectAnswerReveal) {
        return currentState;
      }

      const answeredQuestions = currentState.answeredQuestions + 1;
      const tableProgressByTable = recordTableOutcome(
        currentState.tableProgressByTable,
        currentState.currentFact.left,
        false,
      );
      if (answeredQuestions >= currentState.totalQuestions) {
        return {
          ...currentState,
          answeredQuestions,
          tableProgressByTable,
          incorrectAnswerReveal: null,
          isComplete: true,
        };
      }

      const nextFact = drawFollowingFact(
        factPool,
        currentState.missedFactKeys,
        currentState.currentFact.key,
        random,
      );

      return {
        ...currentState,
        answeredQuestions,
        currentFact: nextFact,
        tableProgressByTable,
        incorrectAnswerReveal: null,
      };
    });
  };

  return {
    totalQuestions: state.totalQuestions,
    answeredQuestions: state.answeredQuestions,
    currentQuestionNumber: Math.min(state.answeredQuestions + 1, state.totalQuestions),
    currentFact: state.currentFact,
    inputValue: state.inputValue,
    correctCount: state.correctCount,
    score: state.score,
    isComplete: state.isComplete,
    tableStats: toSortedTableStats(state.tableProgressByTable),
    missedFactKeys: Array.from(state.missedFactKeys).sort((left, right) => left.localeCompare(right)),
    incorrectAnswerReveal: state.incorrectAnswerReveal,
    appendDigit,
    clearInput,
    backspaceInput,
    submitAnswer,
    proceedAfterIncorrectAnswer,
  };
}
