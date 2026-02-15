import { describe, expect, it } from "vitest";
import { getPracticeScopeTables, normalizePracticeScope, parsePracticeScope } from "../practiceScope";

describe("practiceScope", () => {
  it("returns expected table sets for preset scopes", () => {
    expect(getPracticeScopeTables({ kind: "all" })).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(getPracticeScopeTables({ kind: "lowerRange" })).toEqual([1, 2, 3, 4, 5]);
    expect(getPracticeScopeTables({ kind: "upperRange" })).toEqual([6, 7, 8, 9]);
  });

  it("normalizes custom scope tables", () => {
    expect(normalizePracticeScope({ kind: "custom", tables: [9, 4, 4, 11, 0, 2] })).toEqual({
      kind: "custom",
      tables: [2, 4, 9],
    });
  });

  it("parses valid scopes and rejects invalid data", () => {
    expect(parsePracticeScope({ kind: "lowerRange" })).toEqual({ kind: "lowerRange" });
    expect(parsePracticeScope({ kind: "custom", tables: [7, 7, 8] })).toEqual({
      kind: "custom",
      tables: [7, 8],
    });
    expect(parsePracticeScope({ kind: "custom", tables: [] })).toBeNull();
    expect(parsePracticeScope({ kind: "custom" })).toBeNull();
    expect(parsePracticeScope({ kind: "unknown" })).toBeNull();
  });
});
