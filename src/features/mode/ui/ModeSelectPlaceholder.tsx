type ModeSelectPlaceholderProps = {
  onBack: () => void;
  onStartQuiz: () => void;
};

export function ModeSelectPlaceholder({ onBack, onStartQuiz }: ModeSelectPlaceholderProps) {
  return (
    <section className="panel" aria-labelledby="mode-heading">
      <p className="eyebrow">Mode Select</p>
      <h2 id="mode-heading">Mode Select Placeholder</h2>
      <p>
        Full mode selection lands in M1-04. Use this temporary action to verify the quiz
        interaction loop.
      </p>
      <div className="button-row">
        <button type="button" className="primary-button" onClick={onStartQuiz}>
          Start 10-Question Quiz
        </button>
        <button type="button" className="secondary-button" onClick={onBack}>
          Back to Title
        </button>
      </div>
    </section>
  );
}
