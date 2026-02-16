import { describe, expect, it } from "vitest";
import { createSessionFactPool, resolveSessionQuestionCount } from "../useQuizSession";

describe("useQuizSession helpers", () => {
  it("creates scoped fact pools for practice-range filtering", () => {
    const lowerRangeFacts = createSessionFactPool({ kind: "lowerRange" }, undefined);

    expect(lowerRangeFacts).toHaveLength(45);
    expect(lowerRangeFacts.every((fact) => fact.left <= 5)).toBe(true);
  });

  it("uses review keys as the mini-review trigger when matches exist", () => {
    const reviewFacts = createSessionFactPool({ kind: "all" }, ["2x3", "7x8"]);

    expect(reviewFacts).toHaveLength(2);
    expect(reviewFacts.map((fact) => fact.key)).toEqual(["2x3", "7x8"]);
  });

  it("falls back to scoped facts when review keys do not match", () => {
    const fallbackFacts = createSessionFactPool({ kind: "upperRange" }, ["2x3"]);

    expect(fallbackFacts).toHaveLength(36);
    expect(fallbackFacts.every((fact) => fact.left >= 6)).toBe(true);
  });

  it("caps mini-review length to available review facts", () => {
    expect(resolveSessionQuestionCount(3, 2, true)).toBe(2);
    expect(resolveSessionQuestionCount(0, 1, true)).toBe(1);
  });

  it("keeps normal session length when review mode is off", () => {
    expect(resolveSessionQuestionCount(10, 81, false)).toBe(10);
    expect(resolveSessionQuestionCount(0, 81, false)).toBe(1);
  });
});
