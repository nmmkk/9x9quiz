import { defaultPracticeScope, type PracticeScope } from "../../quiz/domain/practiceScope";
import { useI18n } from "../../../shared/i18n/useI18n";

const selectableScopes: readonly PracticeScope[] = [
  { kind: "all" },
  { kind: "lowerRange" },
  { kind: "upperRange" },
];

type PracticeScopeSelectorProps = {
  selectedScope: PracticeScope;
  onSelectScope: (scope: PracticeScope) => void;
};

function toSelectableScope(scope: PracticeScope): PracticeScope {
  if (scope.kind === "custom") {
    return defaultPracticeScope;
  }

  return scope;
}

export function PracticeScopeSelector({
  selectedScope,
  onSelectScope,
}: PracticeScopeSelectorProps) {
  const { t } = useI18n();
  const selectableScope = toSelectableScope(selectedScope);

  return (
    <div className="practice-scope-selector">
      <h3>{t("mode.scopeHeading")}</h3>
      <p className="practice-scope-description">{t("mode.scopeDescription")}</p>

      <div className="practice-scope-grid" role="group" aria-label={t("mode.scopeAriaLabel")}>
        {selectableScopes.map((scope) => {
          const labelKey =
            scope.kind === "all"
              ? "mode.scopeOptionAll"
              : scope.kind === "lowerRange"
                ? "mode.scopeOptionLowerRange"
                : "mode.scopeOptionUpperRange";

          const isSelected = scope.kind === selectableScope.kind;

          return (
            <button
              key={scope.kind}
              type="button"
              className={`practice-scope-button${isSelected ? " is-selected" : ""}`}
              aria-pressed={isSelected}
              onClick={() => onSelectScope(scope)}
            >
              {t(labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
