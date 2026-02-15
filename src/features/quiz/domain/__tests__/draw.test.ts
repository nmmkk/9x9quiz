import { describe, expect, it } from "vitest";
import { createFactPool, toFactKey, type QuizFact } from "../facts";
import { BASE_FACT_WEIGHT, MISSED_FACT_WEIGHT, drawNextFact, getFactWeight } from "../draw";

describe("createFactPool", () => {
  it("creates exactly 81 ordered facts", () => {
    const facts = createFactPool();

    expect(facts).toHaveLength(81);
    expect(facts[0]).toMatchObject({ left: 1, right: 1, answer: 1, key: "1x1" });
    expect(facts[80]).toMatchObject({ left: 9, right: 9, answer: 81, key: "9x9" });
    expect(facts[8]).toMatchObject({ left: 1, right: 9, key: "1x9" });
    expect(facts[9]).toMatchObject({ left: 2, right: 1, key: "2x1" });
  });

  it("filters facts to lower-range tables", () => {
    const facts = createFactPool({ practiceScope: { kind: "lowerRange" } });

    expect(facts).toHaveLength(45);
    expect(facts.every((fact) => fact.left <= 5)).toBe(true);
  });

  it("filters facts to selected custom tables", () => {
    const facts = createFactPool({
      practiceScope: { kind: "custom", tables: [9, 7] },
    });

    expect(facts).toHaveLength(18);
    expect(Array.from(new Set(facts.map((fact) => fact.left))).sort((left, right) => left - right)).toEqual([
      7,
      9,
    ]);
  });
});

describe("drawNextFact", () => {
  const facts: [QuizFact, QuizFact] = [
    { left: 2, right: 3, answer: 6, key: toFactKey(2, 3) },
    { left: 2, right: 4, answer: 8, key: toFactKey(2, 4) },
  ];

  it("uses +30% weight for missed facts", () => {
    const missedKeys = new Set([facts[1].key]);

    expect(getFactWeight(facts[0], missedKeys)).toBe(BASE_FACT_WEIGHT);
    expect(getFactWeight(facts[1], missedKeys)).toBe(MISSED_FACT_WEIGHT);

    const withMissedWeight = drawNextFact({
      facts,
      missedFactKeys: missedKeys,
      random: () => 0.45,
    });
    const withoutMissedWeight = drawNextFact({
      facts,
      random: () => 0.45,
    });

    expect(withMissedWeight.key).toBe(facts[1].key);
    expect(withoutMissedWeight.key).toBe(facts[0].key);
  });

  it("avoids immediate repeat when alternatives exist", () => {
    const selected = drawNextFact({
      facts,
      previousFactKey: facts[0].key,
      random: () => 0,
    });

    expect(selected.key).toBe(facts[1].key);
  });

  it("allows repeat when there is no alternative", () => {
    const singleFact: [QuizFact] = [facts[0]];

    const selected = drawNextFact({
      facts: singleFact,
      previousFactKey: facts[0].key,
      random: () => 0,
    });

    expect(selected.key).toBe(facts[0].key);
  });
});
