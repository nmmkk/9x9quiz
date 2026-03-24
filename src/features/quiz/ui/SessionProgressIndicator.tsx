import { useI18n } from "../../../shared/i18n/useI18n";

type SessionProgressIndicatorProps = {
  answeredQuestions: number;
  totalQuestions: number;
};

function clampProgressValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function SessionProgressIndicator({
  answeredQuestions,
  totalQuestions,
}: SessionProgressIndicatorProps) {
  const { tf } = useI18n();
  const safeTotalQuestions = Math.max(totalQuestions, 1);
  const safeAnsweredQuestions = clampProgressValue(answeredQuestions, 0, safeTotalQuestions);
  const progressRatio = safeAnsweredQuestions / safeTotalQuestions;
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <div className="quiz-progress-group">
      <p className="quiz-progress-label">
        {tf("quiz.progressLabel", {
          answered: safeAnsweredQuestions,
          total: safeTotalQuestions,
        })}
      </p>
      <div
        className="quiz-progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotalQuestions}
        aria-valuenow={safeAnsweredQuestions}
        aria-label={tf("quiz.progressAriaLabel", {
          answered: safeAnsweredQuestions,
          total: safeTotalQuestions,
        })}
      >
        <span className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  );
}
