import { useEffect, useMemo, useState } from "react";
import { drawNextFact } from "../domain/draw";
import { createFactPool, isAnswerCorrect, type QuizFact } from "../domain/facts";
import { type PracticeScope } from "../domain/practiceScope";
import { applyAnswerScore } from "../domain/scoring";

type IncorrectAnswerReveal = {
  submittedAnswer: number;
  correctAnswer: number;
};

type SessionState = {
  totalQuestions: number;
  answeredQuestions: number;
  currentFact: QuizFact;
  inputValue: string;
  correctCount: number;
  score: number;
  missedFactKeys: Set<string>;
  incorrectAnswerReveal: IncorrectAnswerReveal | null;
  isComplete: boolean;
};

type UseQuizSessionOptions = {
  questionCount: number;
  practiceScope?: PracticeScope;
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
  incorrectAnswerReveal: IncorrectAnswerReveal | null;
  appendDigit: (digit: string) => void;
  clearInput: () => void;
  backspaceInput: () => void;
  submitAnswer: () => void;
  proceedAfterIncorrectAnswer: () => void;
};

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
  random = Math.random,
}: UseQuizSessionOptions): UseQuizSessionResult {
  const totalQuestions = Math.max(1, questionCount);
  const factPool = useMemo(() => createFactPool({ practiceScope }), [practiceScope]);
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
        if (answeredQuestions >= currentState.totalQuestions) {
          return {
            ...currentState,
            answeredQuestions,
            score,
            correctCount,
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
      if (answeredQuestions >= currentState.totalQuestions) {
        return {
          ...currentState,
          answeredQuestions,
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
    incorrectAnswerReveal: state.incorrectAnswerReveal,
    appendDigit,
    clearInput,
    backspaceInput,
    submitAnswer,
    proceedAfterIncorrectAnswer,
  };
}
