import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { formatMessage, getMessage } from "../../../../shared/i18n/catalog";
import { I18nContext } from "../../../../shared/i18n/I18nProvider";
import { type Locale, type MessageKey } from "../../../../shared/i18n/types";
import { ResultScreen } from "../ResultScreen";

type RenderResultScreenOptions = {
  locale: Locale;
  missedFactCount: number;
};

function renderResultScreen({ locale, missedFactCount }: RenderResultScreenOptions): string {
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
      <ResultScreen
        mode={10}
        correctCount={8}
        totalQuestions={10}
        score={80}
        missedFactCount={missedFactCount}
        onStartMissedFactReview={() => undefined}
        onPlayAgain={() => undefined}
        onBackToTitle={() => undefined}
      />
    </I18nContext.Provider>,
  );
}

describe("ResultScreen", () => {
  it("shows a count-aware review button for 1 and 2 missed facts in Japanese", () => {
    const oneMissMarkup = renderResultScreen({ locale: "ja-JP", missedFactCount: 1 });
    const twoMissMarkup = renderResultScreen({ locale: "ja-JP", missedFactCount: 2 });

    expect(oneMissMarkup).toContain("まちがえた1もんを ふくしゅう");
    expect(twoMissMarkup).toContain("まちがえた2もんを ふくしゅう");
  });

  it("shows a count-aware review button for 1 and 2 missed facts in English", () => {
    const oneMissMarkup = renderResultScreen({ locale: "en", missedFactCount: 1 });
    const twoMissMarkup = renderResultScreen({ locale: "en", missedFactCount: 2 });

    expect(oneMissMarkup).toContain("Review 1 Missed Facts");
    expect(twoMissMarkup).toContain("Review 2 Missed Facts");
  });
});
