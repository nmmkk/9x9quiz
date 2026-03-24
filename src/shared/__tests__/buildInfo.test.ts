import { describe, expect, it } from "vitest";
import { getBuildInfo } from "../buildInfo";

describe("getBuildInfo", () => {
  it("formats version and short SHA from build metadata", () => {
    const buildInfo = getBuildInfo({
      VITE_APP_VERSION: "0.1.0",
      VITE_COMMIT_SHORT_SHA: "abc1234",
      VITE_COMMIT_URL: "https://github.com/nmmkk/9x9quiz/commit/abc1234",
    });

    expect(buildInfo).toEqual({
      displayText: "v0.1.0 (abc1234)",
      commitUrl: "https://github.com/nmmkk/9x9quiz/commit/abc1234",
    });
  });

  it("falls back to explicit placeholder values when metadata is missing", () => {
    const buildInfo = getBuildInfo({
      VITE_APP_VERSION: "",
      VITE_COMMIT_SHORT_SHA: "",
      VITE_COMMIT_URL: "",
    });

    expect(buildInfo).toEqual({
      displayText: "v0.0.0 (dev)",
      commitUrl: null,
    });
  });

  it("drops invalid commit URLs instead of linking to them", () => {
    const buildInfo = getBuildInfo({
      VITE_APP_VERSION: "0.1.0",
      VITE_COMMIT_SHORT_SHA: "abc1234",
      VITE_COMMIT_URL: "javascript:alert(1)",
    });

    expect(buildInfo).toEqual({
      displayText: "v0.1.0 (abc1234)",
      commitUrl: null,
    });
  });
});
