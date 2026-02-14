import {
  questionCountModes,
  readHighScore,
  type QuestionCountMode,
} from "../../../shared/storage/highScoreStorage";

type ModeSelectScreenProps = {
  onBack: () => void;
  onStartQuiz: (mode: QuestionCountMode) => void;
};

export function ModeSelectScreen({ onBack, onStartQuiz }: ModeSelectScreenProps) {
  return (
    <section className="panel" aria-labelledby="mode-heading">
      <p className="eyebrow">Mode Select</p>
      <h2 id="mode-heading">Choose Question Count</h2>
      <p>Pick a mode to start immediately. High scores are shown when available.</p>

      <div className="mode-grid" role="list" aria-label="Question count modes">
        {questionCountModes.map((mode) => {
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
