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
  return (
    <div className="numeric-pad" aria-label="On-screen number pad">
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
          Clear
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
          Backspace
        </button>
      </div>

      <button
        type="button"
        className="primary-button submit-button"
        disabled={disabled || submitDisabled}
        onClick={onSubmit}
      >
        Submit
      </button>
    </div>
  );
}
