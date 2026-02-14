import { useEffect, useRef } from "react";
import { useQuizSession } from "../state/useQuizSession";
import { IncorrectAnswerOverlay } from "./IncorrectAnswerOverlay";
import { NumericPad } from "./NumericPad";

export type QuizSessionResult = {
  correctCount: number;
  totalQuestions: number;
  score: number;
};

type QuizScreenProps = {
  questionCount: number;
  onComplete: (result: QuizSessionResult) => void;
};

export function QuizScreen({ questionCount, onComplete }: QuizScreenProps) {
  const {
    totalQuestions,
    currentQuestionNumber,
    currentFact,
    inputValue,
    score,
    correctCount,
    isComplete,
    incorrectAnswerReveal,
    appendDigit,
    clearInput,
    backspaceInput,
    submitAnswer,
    proceedAfterIncorrectAnswer,
  } = useQuizSession({ questionCount });
  const hasReportedComplete = useRef(false);

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
    });
  }, [correctCount, isComplete, onComplete, score, totalQuestions]);

  const hasInput = inputValue.length > 0;
  const isOverlayVisible = incorrectAnswerReveal !== null;
  const answerDisplay = hasInput ? inputValue : "__";

  return (
    <section className="panel quiz-panel" aria-labelledby="quiz-heading">
      <p className="eyebrow">Quiz</p>
      <h2 id="quiz-heading">Solve Each Fact</h2>

      <div className="quiz-header">
        <p>
          {currentQuestionNumber} / {totalQuestions}
        </p>
        <p>Score: {score}</p>
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
