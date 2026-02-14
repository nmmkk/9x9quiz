type TitleScreenProps = {
  onStart: () => void;
  onOpenHighScores: () => void;
};

export function TitleScreen({ onStart, onOpenHighScores }: TitleScreenProps) {
  return (
    <section className="panel" aria-labelledby="title-heading">
      <p className="eyebrow">Title</p>
      <h1 id="title-heading">9x9quiz</h1>
      <p>Practice multiplication facts with short, focused quiz rounds.</p>
      <div className="button-row">
        <button type="button" className="primary-button" onClick={onStart}>
          Start
        </button>
        <button type="button" className="secondary-button" onClick={onOpenHighScores}>
          High Scores
        </button>
      </div>
    </section>
  );
}
