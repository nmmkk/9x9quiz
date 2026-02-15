import { beforeEach, describe, expect, it } from "vitest";
import { pickMessageVariant, resetMessageVariantHistory } from "../messageVariants";

describe("messageVariants", () => {
  beforeEach(() => {
    resetMessageVariantHistory();
  });

  it("throws when no variants are provided", () => {
    expect(() => pickMessageVariant("result.newHighScore", [])).toThrow(
      "[messageVariants] At least one variant is required.",
    );
  });

  it("returns the only variant when one option exists", () => {
    const variants = ["single"] as const;

    expect(pickMessageVariant("result.newHighScore", variants, () => 0.9)).toBe("single");
    expect(pickMessageVariant("result.newHighScore", variants, () => 0.1)).toBe("single");
  });

  it("avoids immediate repeats when alternatives exist", () => {
    const variants = ["v1", "v2", "v3"] as const;

    const first = pickMessageVariant("result.newHighScore", variants, () => 0);
    const second = pickMessageVariant("result.newHighScore", variants, () => 0);
    const third = pickMessageVariant("result.newHighScore", variants, () => 0);

    expect(first).toBe("v1");
    expect(second).toBe("v2");
    expect(third).toBe("v1");
    expect(second).not.toBe(first);
    expect(third).not.toBe(second);
  });

  it("tracks no-repeat history independently per message group", () => {
    const variants = ["v1", "v2", "v3"] as const;

    expect(pickMessageVariant("result.newHighScore", variants, () => 0)).toBe("v1");
    expect(pickMessageVariant("result.replayEncouragement", variants, () => 0)).toBe("v1");
    expect(pickMessageVariant("result.newHighScore", variants, () => 0)).toBe("v2");
    expect(pickMessageVariant("result.replayEncouragement", variants, () => 0)).toBe("v2");
  });
});
