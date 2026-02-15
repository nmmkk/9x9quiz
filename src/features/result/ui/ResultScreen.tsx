import { useState } from "react";
import {
  updateHighScore,
  type HighScoreUpdateResult,
  type QuestionCountMode,
} from "../../../shared/storage/highScoreStorage";
import { useI18n } from "../../../shared/i18n/useI18n";

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
  const { t, tf } = useI18n();
  const [highScoreResult] = useState<HighScoreUpdateResult>(() => updateHighScore(mode, score));

  return (
    <section className="panel result-panel" aria-labelledby="result-heading">
      <p className="eyebrow">{t("result.eyebrow")}</p>
      <h2 id="result-heading">{t("result.heading")}</h2>

      <p>{tf("result.correctLabel", { correct: correctCount, total: totalQuestions })}</p>
      <p className="result-score">{tf("result.scoreLabel", { score })}</p>
      <p>{tf("result.modeHighScoreLabel", { mode, score: highScoreResult.highScore })}</p>

      <p className="result-status" aria-live="polite">
        {highScoreResult.isNewHighScore ? t("result.newHighScore") : t("result.highScoreUnchanged")}
      </p>

      <div className="button-row">
        <button type="button" className="primary-button" onClick={onPlayAgain}>
          {t("result.playAgainButton")}
        </button>
        <button type="button" className="secondary-button" onClick={onBackToTitle}>
          {t("result.titleButton")}
        </button>
      </div>
    </section>
  );
}
