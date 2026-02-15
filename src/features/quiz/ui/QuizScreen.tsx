import { useEffect, useRef, useState } from "react";
import { useI18n } from "../../../shared/i18n/useI18n";
import { type PracticeScope } from "../domain/practiceScope";
import { useQuizSession } from "../state/useQuizSession";
import { IncorrectAnswerOverlay } from "./IncorrectAnswerOverlay";
import { NumericPad } from "./NumericPad";

export type QuizSessionResult = {
  correctCount: number;
  totalQuestions: number;
  score: number;
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
    currentQuestionNumber,
    currentFact,
    inputValue,
    score,
    correctCount,
    isComplete,
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
      missedFactKeys,
    });
  }, [correctCount, isComplete, missedFactKeys, onComplete, score, totalQuestions]);

  const hasInput = inputValue.length > 0;
  const isOverlayVisible = incorrectAnswerReveal !== null;
  const answerDisplay = hasInput ? inputValue : "__";

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
      </div>

      <p className="quiz-expression">
        {currentFact.left} x {currentFact.right} = <span className="answer-slot">{answerDisplay}</span>
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
