import { useEffect, useRef, useState } from "react";
import { useI18n } from "../../../shared/i18n/useI18n";
import { type PracticeScope } from "../domain/practiceScope";
import { useQuizSession } from "../state/useQuizSession";
import { IncorrectAnswerOverlay } from "./IncorrectAnswerOverlay";
import { NumericPad } from "./NumericPad";
import { SessionProgressIndicator } from "./SessionProgressIndicator";

type QuizKeyboardAction = "backspace" | "clear" | "submit" | { digit: string };

export function resolveQuizKeyboardAction(event: Pick<KeyboardEvent, "key" | "altKey" | "ctrlKey" | "metaKey">): QuizKeyboardAction | null {
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return null;
  }

  if (/^\d$/.test(event.key)) {
    return { digit: event.key };
  }

  if (event.key === "Backspace") {
    return "backspace";
  }

  if (event.key === "Delete") {
    return "clear";
  }

  if (event.key === "Enter") {
    return "submit";
  }

  return null;
}

export type QuizSessionResult = {
  correctCount: number;
  totalQuestions: number;
  score: number;
  tableStats: readonly {
    table: number;
    answered: number;
    correct: number;
  }[];
  missedFactKeys: readonly string[];
};

type QuizScreenProps = {
  questionCount: number;
  practiceScope: PracticeScope;
  reviewFactKeys?: readonly string[];
  onComplete: (result: QuizSessionResult) => void;
};

export function QuizScreen({
  questionCount,
  practiceScope,
  reviewFactKeys,
  onComplete,
}: QuizScreenProps) {
  const { tf } = useI18n();
  const {
    totalQuestions,
    answeredQuestions,
    currentQuestionNumber,
    currentFact,
    inputValue,
    score,
    correctCount,
    isComplete,
    tableStats,
    missedFactKeys,
    incorrectAnswerReveal,
    appendDigit,
    clearInput,
    backspaceInput,
    submitAnswer,
    proceedAfterIncorrectAnswer,
  } = useQuizSession({ questionCount, practiceScope, reviewFactKeys });
  const hasReportedComplete = useRef(false);
  const previousCorrectCount = useRef(correctCount);
  const [isCorrectFeedbackActive, setIsCorrectFeedbackActive] = useState(false);
  const [keyboardInputFeedbackCount, setKeyboardInputFeedbackCount] = useState(0);
  const [keyboardSubmitFeedbackCount, setKeyboardSubmitFeedbackCount] = useState(0);

  useEffect(() => {
    const hasNewCorrectAnswer = correctCount > previousCorrectCount.current;
    previousCorrectCount.current = correctCount;

    if (!hasNewCorrectAnswer) {
      return;
    }

    setIsCorrectFeedbackActive(true);
    const timeoutId = globalThis.setTimeout(() => {
      setIsCorrectFeedbackActive(false);
    }, 220);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [correctCount]);

  useEffect(() => {
    if (!isComplete) {
      hasReportedComplete.current = false;
      return;
    }

    if (hasReportedComplete.current) {
      return;
    }

    hasReportedComplete.current = true;
    onComplete({
      correctCount,
      totalQuestions,
      score,
      tableStats,
      missedFactKeys,
    });
  }, [correctCount, isComplete, missedFactKeys, onComplete, score, tableStats, totalQuestions]);

  const hasInput = inputValue.length > 0;
  const isOverlayVisible = incorrectAnswerReveal !== null;
  const answerDisplay = hasInput ? inputValue : "__";
  const keyboardFeedbackClassName =
    keyboardInputFeedbackCount === 0
      ? ""
      : keyboardInputFeedbackCount % 2 === 0
        ? "answer-slot--keyboard-feedback-a"
        : "answer-slot--keyboard-feedback-b";
  const keyboardSubmitFeedbackClassName =
    keyboardSubmitFeedbackCount === 0
      ? ""
      : keyboardSubmitFeedbackCount % 2 === 0
        ? "answer-slot--submit-feedback-a"
        : "answer-slot--submit-feedback-b";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const action = resolveQuizKeyboardAction(event);
      if (action === null) {
        return;
      }

      event.preventDefault();

      if (typeof action === "string") {
        if (action === "backspace") {
          backspaceInput();
          return;
        }

        if (action === "clear") {
          clearInput();
          return;
        }

        if (hasInput && !isComplete && !isOverlayVisible) {
          setKeyboardSubmitFeedbackCount((currentValue) => currentValue + 1);
        }

        submitAnswer();
        return;
      }

      setKeyboardInputFeedbackCount((currentValue) => currentValue + 1);
      appendDigit(action.digit);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [appendDigit, backspaceInput, clearInput, hasInput, isComplete, isOverlayVisible, submitAnswer]);

  return (
    <section
      className={`panel quiz-panel${isCorrectFeedbackActive ? " quiz-panel--correct-feedback" : ""}`}
      aria-labelledby="quiz-heading"
    >
      <div
        className={`correct-feedback-burst${isCorrectFeedbackActive ? " is-active" : ""}`}
        aria-hidden="true"
      />
      <h2 id="quiz-heading">{tf("quiz.currentQuestionLabel", { current: currentQuestionNumber })}</h2>

      <div className="quiz-header">
        <p>{tf("quiz.scoreLabel", { score })}</p>
        <SessionProgressIndicator
          answeredQuestions={answeredQuestions}
          totalQuestions={totalQuestions}
        />
      </div>

      <p className="quiz-expression">
        {currentFact.left} x {currentFact.right} ={" "}
        <span className={`answer-slot ${keyboardFeedbackClassName} ${keyboardSubmitFeedbackClassName}`.trim()}>
          {answerDisplay}
        </span>
      </p>

      <NumericPad
        disabled={isComplete || isOverlayVisible}
        submitDisabled={!hasInput}
        onDigit={appendDigit}
        onClear={clearInput}
        onBackspace={backspaceInput}
        onSubmit={submitAnswer}
      />

      {incorrectAnswerReveal ? (
        <IncorrectAnswerOverlay
          submittedAnswer={incorrectAnswerReveal.submittedAnswer}
          correctAnswer={incorrectAnswerReveal.correctAnswer}
          onNext={proceedAfterIncorrectAnswer}
        />
      ) : null}
    </section>
  );
}
