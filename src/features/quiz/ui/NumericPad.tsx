import { useI18n } from "../../../shared/i18n/useI18n";

type NumericPadProps = {
  disabled?: boolean;
  submitDisabled: boolean;
  onDigit: (digit: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onSubmit: () => void;
};

const digitRows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
];

export function NumericPad({
  disabled = false,
  submitDisabled,
  onDigit,
  onClear,
  onBackspace,
  onSubmit,
}: NumericPadProps) {
  const { t } = useI18n();

  return (
    <div className="numeric-pad" aria-label={t("quiz.numberPadAriaLabel")}>
      {digitRows.map((row) => (
        <div key={row.join("-")} className="numeric-pad-row">
          {row.map((digit) => (
            <button
              key={digit}
              type="button"
              className="numeric-button"
              disabled={disabled}
              onClick={() => onDigit(digit)}
            >
              {digit}
            </button>
          ))}
        </div>
      ))}

      <div className="numeric-pad-row">
        <button type="button" className="numeric-action-button" disabled={disabled} onClick={onClear}>
          {t("quiz.clearButton")}
        </button>
        <button type="button" className="numeric-button" disabled={disabled} onClick={() => onDigit("0")}>
          0
        </button>
        <button
          type="button"
          className="numeric-action-button"
          disabled={disabled}
          onClick={onBackspace}
        >
          {t("quiz.backspaceButton")}
        </button>
      </div>

      <button
        type="button"
        className="primary-button submit-button"
        disabled={disabled || submitDisabled}
        onClick={onSubmit}
      >
        {t("quiz.submitButton")}
      </button>
    </div>
  );
}
