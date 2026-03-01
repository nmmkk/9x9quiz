import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { formatMessage, getMessage } from "../../../../shared/i18n/catalog";
import { I18nContext } from "../../../../shared/i18n/I18nProvider";
import { type Locale, type MessageKey } from "../../../../shared/i18n/types";
import { type MasterySnapshot } from "../../../../shared/storage/masteryStorage";
import { MasteryPanel } from "../MasteryPanel";

const sampleMasterySnapshot: MasterySnapshot = [
  { table: 1, answered: 2, correct: 2 },
  { table: 2, answered: 0, correct: 0 },
  { table: 3, answered: 1, correct: 0 },
  { table: 4, answered: 4, correct: 3 },
  { table: 5, answered: 0, correct: 0 },
  { table: 6, answered: 0, correct: 0 },
  { table: 7, answered: 0, correct: 0 },
  { table: 8, answered: 0, correct: 0 },
  { table: 9, answered: 0, correct: 0 },
];

function renderPanel(locale: Locale, canStartDirectPractice: boolean): string {
  const t = (key: MessageKey) => getMessage(locale, key);
  const tf = (key: MessageKey, values: Record<string, string | number>) =>
    formatMessage(getMessage(locale, key), values);

  return renderToStaticMarkup(
    <I18nContext.Provider
      value={{
        locale,
        setLocale: (_locale: Locale) => undefined,
        t,
        tf,
      }}
    >
      <MasteryPanel
        masterySnapshot={sampleMasterySnapshot}
        onStartTablePractice={canStartDirectPractice ? () => undefined : undefined}
      />
    </I18nContext.Provider>,
  );
}

describe("MasteryPanel", () => {
  it("shows direct-practice buttons when callback is provided", () => {
    const markup = renderPanel("ja-JP", true);

    expect(markup).toContain("1のだんを れんしゅう");
    expect(markup).toContain("9のだんを れんしゅう");
  });

  it("does not show direct-practice buttons when callback is not provided", () => {
    const markup = renderPanel("en", false);

    expect(markup).not.toContain("Practice table 1");
  });
});
