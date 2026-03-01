import { useI18n } from "../../../shared/i18n/useI18n";
import { type MasterySnapshot } from "../../../shared/storage/masteryStorage";

type MasteryPanelProps = {
  masterySnapshot: MasterySnapshot;
  onStartTablePractice?: (table: number) => void;
};

function getMasteryClassName(answered: number, accuracyPercent: number | null): string {
  if (answered === 0 || accuracyPercent === null) {
    return "mastery-card mastery-card--idle";
  }

  if (accuracyPercent >= 80) {
    return "mastery-card mastery-card--strong";
  }

  if (accuracyPercent >= 50) {
    return "mastery-card mastery-card--growing";
  }

  return "mastery-card mastery-card--practice";
}

export function MasteryPanel({ masterySnapshot, onStartTablePractice }: MasteryPanelProps) {
  const { t, tf } = useI18n();

  return (
    <section className="mastery-panel" aria-labelledby="mastery-heading">
      <h3 id="mastery-heading">{t("progress.masteryHeading")}</h3>
      <p className="mastery-description">{t("progress.masteryDescription")}</p>

      <div className="mastery-grid" role="list">
        {masterySnapshot.map((stat) => {
          const accuracyPercent =
            stat.answered === 0 ? null : Math.round((stat.correct / stat.answered) * 100);

          return (
            <div
              key={stat.table}
              className={getMasteryClassName(stat.answered, accuracyPercent)}
              role="listitem"
              aria-label={tf("progress.masteryAriaLabel", {
                table: stat.table,
                correct: stat.correct,
                answered: stat.answered,
              })}
            >
              <p className="mastery-table-label">{tf("progress.masteryTableLabel", { table: stat.table })}</p>
              <p className="mastery-value">
                {stat.answered === 0
                  ? t("progress.masteryNoAttempts")
                  : tf("progress.masteryValueLabel", {
                      correct: stat.correct,
                      answered: stat.answered,
                    })}
              </p>
              <p className="mastery-rate">{accuracyPercent === null ? "-" : `${accuracyPercent}%`}</p>
              {onStartTablePractice ? (
                <button
                  type="button"
                  className="secondary-button mastery-practice-button"
                  onClick={() => onStartTablePractice(stat.table)}
                >
                  {tf("progress.masteryPracticeButton", { table: stat.table })}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
