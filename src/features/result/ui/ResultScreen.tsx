import { useState } from "react";
import {
  updateHighScore,
  type HighScoreUpdateResult,
  type QuestionCountMode,
} from "../../../shared/storage/highScoreStorage";

type ResultScreenProps = {
  mode: QuestionCountMode;
  correctCount: number;
  totalQuestions: number;
  score: number;
  onPlayAgain: () => void;
  onBackToTitle: () => void;
};

export function ResultScreen({
  mode,
  correctCount,
  totalQuestions,
  score,
  onPlayAgain,
  onBackToTitle,
}: ResultScreenProps) {
  const [highScoreResult] = useState<HighScoreUpdateResult>(() => updateHighScore(mode, score));

  return (
    <section className="panel result-panel" aria-labelledby="result-heading">
      <p className="eyebrow">Result</p>
      <h2 id="result-heading">Session End</h2>

      <p>
        Correct: {correctCount} / {totalQuestions}
      </p>
      <p className="result-score">Score: {score}</p>
      <p>Mode {mode} high score: {highScoreResult.highScore}</p>

      <p className="result-status" aria-live="polite">
        {highScoreResult.isNewHighScore ? "New High Score!" : "High score unchanged."}
      </p>

      <div className="button-row">
        <button type="button" className="primary-button" onClick={onPlayAgain}>
          Play Again
        </button>
        <button type="button" className="secondary-button" onClick={onBackToTitle}>
          Title
        </button>
      </div>
    </section>
  );
}
