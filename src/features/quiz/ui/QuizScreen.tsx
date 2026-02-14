import { useQuizSession } from "../state/useQuizSession";
import { IncorrectAnswerOverlay } from "./IncorrectAnswerOverlay";
import { NumericPad } from "./NumericPad";

type QuizScreenProps = {
  questionCount: number;
  onExit: () => void;
};

export function QuizScreen({ questionCount, onExit }: QuizScreenProps) {
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
    restartSession,
  } = useQuizSession({ questionCount });

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

      {isComplete ? (
        <section className="quiz-complete" aria-live="polite">
          <h3>Session Complete</h3>
          <p>
            Correct answers: {correctCount} / {totalQuestions}
          </p>
          <p>Final score: {score}</p>
          <div className="button-row">
            <button type="button" className="primary-button" onClick={restartSession}>
              Play Again
            </button>
            <button type="button" className="secondary-button" onClick={onExit}>
              Back to Title
            </button>
          </div>
        </section>
      ) : null}

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
