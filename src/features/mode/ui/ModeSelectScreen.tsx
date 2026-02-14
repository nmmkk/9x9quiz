export type QuestionCountMode = 10 | 20 | 30;

type ModeSelectScreenProps = {
  onBack: () => void;
  onStartQuiz: (mode: QuestionCountMode) => void;
};

const modeOptions: readonly QuestionCountMode[] = [10, 20, 30];

function highScoreStorageKey(mode: QuestionCountMode): string {
  return `9x9quiz.v1.highScore.${mode}`;
}

function readHighScore(mode: QuestionCountMode): number | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawScore = window.localStorage.getItem(highScoreStorageKey(mode));
  if (rawScore === null) {
    return null;
  }

  const score = Number(rawScore);
  if (!Number.isFinite(score) || score < 0) {
    return null;
  }

  return Math.floor(score);
}

export function ModeSelectScreen({ onBack, onStartQuiz }: ModeSelectScreenProps) {
  return (
    <section className="panel" aria-labelledby="mode-heading">
      <p className="eyebrow">Mode Select</p>
      <h2 id="mode-heading">Choose Question Count</h2>
      <p>Pick a mode to start immediately. High scores are shown when available.</p>

      <div className="mode-grid" role="list" aria-label="Question count modes">
        {modeOptions.map((mode) => {
          const highScore = readHighScore(mode);

          return (
            <div key={mode} className="mode-card" role="listitem">
              <button
                type="button"
                className="primary-button mode-start-button"
                onClick={() => onStartQuiz(mode)}
              >
                {mode} Questions
              </button>
              <p className="mode-high-score">
                High Score: {highScore === null ? "No record" : highScore}
              </p>
            </div>
          );
        })}
      </div>

      <button type="button" className="secondary-button" onClick={onBack}>
        Back to Title
      </button>
    </section>
  );
}
