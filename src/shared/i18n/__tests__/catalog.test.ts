import { describe, expect, it } from "vitest";
import { formatMessage, getMessage, messageCatalogs } from "../catalog";
import { locales, messageKeys, type MessageKey } from "../types";

describe("catalog", () => {
  it("keeps complete key parity across locales", () => {
    const expectedKeys = [...messageKeys].sort();

    for (const locale of locales) {
      const localeKeys = Object.keys(messageCatalogs[locale]).sort();

      expect(localeKeys).toEqual(expectedKeys);
    }
  });

  it("stores non-empty text for each locale and key", () => {
    for (const locale of locales) {
      for (const key of messageKeys) {
        expect(messageCatalogs[locale][key].trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("falls back to english when a locale entry is missing", () => {
    const key: MessageKey = "title.startButton";
    const jaCatalog = messageCatalogs["ja-JP"] as unknown as Record<string, string>;
    const fallbackCatalog = messageCatalogs.en;
    const originalMessage = jaCatalog[key];

    if (originalMessage === undefined) {
      throw new Error("Test setup failed: ja-JP key not found.");
    }

    delete jaCatalog[key];

    try {
      expect(getMessage("ja-JP", key)).toBe(fallbackCatalog[key]);
    } finally {
      jaCatalog[key] = originalMessage;
    }
  });

  it("returns the key itself for missing messages outside dev mode", () => {
    const missingKey = "test.missing.key";

    if (import.meta.env.DEV) {
      expect(() => getMessage("ja-JP", missingKey)).toThrow(
        `[i18n] Missing message key "${missingKey}" for locale "ja-JP".`,
      );
      return;
    }

    expect(getMessage("ja-JP", missingKey)).toBe(missingKey);
  });

  it("formats placeholders while preserving unknown tokens", () => {
    const template = "{count} items ({unknown})";

    expect(formatMessage(template, { count: 3 })).toBe("3 items ({unknown})");
  });
});
