import {
  questionCountModes,
  readHighScore,
  type QuestionCountMode,
} from "../../../shared/storage/highScoreStorage";
import { useI18n } from "../../../shared/i18n/useI18n";

type ModeSelectScreenProps = {
  onBack: () => void;
  onStartQuiz: (mode: QuestionCountMode) => void;
};

export function ModeSelectScreen({ onBack, onStartQuiz }: ModeSelectScreenProps) {
  const { t, tf } = useI18n();

  return (
    <section className="panel" aria-labelledby="mode-heading">
      <h2 id="mode-heading">{t("mode.heading")}</h2>
      <p>{t("mode.description")}</p>

      <div className="mode-grid" role="list" aria-label={t("mode.listAriaLabel")}>
        {questionCountModes.map((mode) => {
          const highScore = readHighScore(mode);

          return (
            <div key={mode} className="mode-card" role="listitem">
              <button
                type="button"
                className="primary-button mode-start-button"
                onClick={() => onStartQuiz(mode)}
              >
                {tf("mode.optionLabel", { count: mode })}
              </button>
              <p className="mode-high-score">
                {t("mode.highScoreLabel")}: {" "}
                {highScore === null ? (
                  t("mode.noRecord")
                ) : (
                  <strong className="mode-high-score-value">{highScore}</strong>
                )}
              </p>
            </div>
          );
        })}
      </div>

      <button type="button" className="secondary-button" onClick={onBack}>
        {t("mode.backToTitleButton")}
      </button>
    </section>
  );
}
