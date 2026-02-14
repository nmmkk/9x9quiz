type ModeSelectPlaceholderProps = {
  onBack: () => void;
};

export function ModeSelectPlaceholder({ onBack }: ModeSelectPlaceholderProps) {
  return (
    <section className="panel" aria-labelledby="mode-heading">
      <p className="eyebrow">Screen state routing demo</p>
      <h2 id="mode-heading">Mode Select (Coming Soon)</h2>
      <p>This placeholder verifies navigation wiring for the upcoming tickets.</p>
      <button type="button" className="secondary-button" onClick={onBack}>
        Back to Title
      </button>
    </section>
  );
}
