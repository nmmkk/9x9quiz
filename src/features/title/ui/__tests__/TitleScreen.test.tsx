import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { I18nContext } from "../../../../shared/i18n/I18nProvider";
import { formatMessage, getMessage } from "../../../../shared/i18n/catalog";
import { type Locale, type MessageKey } from "../../../../shared/i18n/types";
import { TitleScreen } from "../TitleScreen";

vi.mock("../../../../shared/buildInfo", () => ({
  getBuildInfo: () => ({
    displayText: "v0.1.0 (abc1234)",
    commitUrl: "https://github.com/nmmkk/9x9quiz/commit/abc1234",
  }),
}));

function renderTitleScreen(locale: Locale): string {
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
      <TitleScreen
        lastPlayedMode={10}
        masterySnapshot={[]}
        onStart={() => undefined}
        onOpenModeSelect={() => undefined}
      />
    </I18nContext.Provider>,
  );
}

describe("TitleScreen", () => {
  it("renders a provenance footer link when commit metadata is available", () => {
    const markup = renderTitleScreen("ja-JP");

    expect(markup).toContain("v0.1.0 (abc1234)");
    expect(markup).toContain("href=\"https://github.com/nmmkk/9x9quiz/commit/abc1234\"");
    expect(markup).toContain("target=\"_blank\"");
  });
});
