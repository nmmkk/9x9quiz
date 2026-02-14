type IncorrectAnswerOverlayProps = {
  submittedAnswer: number;
  correctAnswer: number;
  onNext: () => void;
};

export function IncorrectAnswerOverlay({
  submittedAnswer,
  correctAnswer,
  onNext,
}: IncorrectAnswerOverlayProps) {
  return (
    <div className="overlay-backdrop" role="presentation">
      <section className="overlay-panel" role="dialog" aria-modal="true" aria-labelledby="incorrect-title">
        <h3 id="incorrect-title">Not Correct</h3>
        <p>You entered: {submittedAnswer}</p>
        <p>Correct answer: {correctAnswer}</p>
        <button type="button" className="primary-button" onClick={onNext}>
          Next
        </button>
      </section>
    </div>
  );
}
