type TitleScreenProps = {
  onStart: () => void;
};

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <section className="panel" aria-labelledby="title-heading">
      <p className="eyebrow">Web MVP foundation</p>
      <h1 id="title-heading">9x9quiz</h1>
      <p>Practice multiplication facts with a tap-first quiz flow.</p>
      <button type="button" className="primary-button" onClick={onStart}>
        Start
      </button>
    </section>
  );
}
