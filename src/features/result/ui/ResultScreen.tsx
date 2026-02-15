import { useState } from "react";
import {
  updateHighScore,
  type HighScoreUpdateResult,
  type QuestionCountMode,
} from "../../../shared/storage/highScoreStorage";
import { pickMessageVariant } from "../../../shared/feedback/messageVariants";
import { type MessageKey } from "../../../shared/i18n/types";
import { useI18n } from "../../../shared/i18n/useI18n";

const newHighScoreMessageKeys = [
  "result.newHighScoreVariant1",
  "result.newHighScoreVariant2",
  "result.newHighScoreVariant3",
] as const satisfies readonly MessageKey[];

const replayEncouragementMessageKeys = [
  "result.replayEncouragementVariant1",
  "result.replayEncouragementVariant2",
  "result.replayEncouragementVariant3",
] as const satisfies readonly MessageKey[];

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
  const [statusMessageKey] = useState<MessageKey>(() =>
    highScoreResult.isNewHighScore
      ? pickMessageVariant("result.newHighScore", newHighScoreMessageKeys)
      : pickMessageVariant("result.replayEncouragement", replayEncouragementMessageKeys),
  );

  return (
    <section className="panel result-panel result-panel--entry" aria-labelledby="result-heading">
      <p className="eyebrow">{t("result.eyebrow")}</p>
      <h2 id="result-heading">{t("result.heading")}</h2>

      <p>{tf("result.correctLabel", { correct: correctCount, total: totalQuestions })}</p>
      <p className="result-score">{tf("result.scoreLabel", { score })}</p>
      <p>{tf("result.modeHighScoreLabel", { mode, score: highScoreResult.highScore })}</p>

      <p className="result-status" aria-live="polite">
        {t(statusMessageKey)}
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
