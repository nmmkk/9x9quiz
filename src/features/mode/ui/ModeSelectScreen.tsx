import { useState } from "react";
import { defaultPracticeScope, type PracticeScope } from "../../quiz/domain/practiceScope";
import {
  questionCountModes,
  readHighScore,
  type QuestionCountMode,
} from "../../../shared/storage/highScoreStorage";
import { useI18n } from "../../../shared/i18n/useI18n";
import { PracticeScopeSelector } from "./PracticeScopeSelector";

type ModeSelectScreenProps = {
  onBack: () => void;
  initialPracticeScope: PracticeScope;
  onStartQuiz: (mode: QuestionCountMode, scope: PracticeScope) => void;
};

function toSelectableScope(scope: PracticeScope): PracticeScope {
  if (scope.kind === "custom") {
    return defaultPracticeScope;
  }

  return scope;
}

export function ModeSelectScreen({
  onBack,
  initialPracticeScope,
  onStartQuiz,
}: ModeSelectScreenProps) {
  const { t, tf } = useI18n();
  const [selectedPracticeScope, setSelectedPracticeScope] = useState<PracticeScope>(
    () => toSelectableScope(initialPracticeScope),
  );

  return (
    <section className="panel" aria-labelledby="mode-heading">
      <h2 id="mode-heading">{t("mode.heading")}</h2>
      <p>{t("mode.description")}</p>

      <PracticeScopeSelector
        selectedScope={selectedPracticeScope}
        onSelectScope={setSelectedPracticeScope}
      />

      <div className="mode-grid" role="list" aria-label={t("mode.listAriaLabel")}>
        {questionCountModes.map((mode) => {
          const highScore = readHighScore(mode);

          return (
            <div key={mode} className="mode-card" role="listitem">
              <button
                type="button"
                className="primary-button mode-start-button"
                onClick={() => onStartQuiz(mode, selectedPracticeScope)}
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
