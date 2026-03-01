import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { formatMessage, getMessage } from "../../../../shared/i18n/catalog";
import { I18nContext } from "../../../../shared/i18n/I18nProvider";
import { type Locale, type MessageKey } from "../../../../shared/i18n/types";
import { SessionProgressIndicator } from "../SessionProgressIndicator";

function renderIndicator(locale: Locale, answeredQuestions: number, totalQuestions: number): string {
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
      <SessionProgressIndicator
        answeredQuestions={answeredQuestions}
        totalQuestions={totalQuestions}
      />
    </I18nContext.Provider>,
  );
}

function countMatches(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0;
}

describe("SessionProgressIndicator", () => {
  it("shows localized label and progress width in Japanese", () => {
    const markup = renderIndicator("ja-JP", 2, 5);

    expect(markup).toContain("しんちょく: 2/5");
    expect(markup).toContain("width:40%");
  });

  it("activates progress icons based on answered ratio", () => {
    const markup = renderIndicator("en", 3, 5);

    expect(markup).toContain("Progress: 3/5");
    expect(countMatches(markup, /quiz-progress-icon is-active/g)).toBe(3);
  });
});
