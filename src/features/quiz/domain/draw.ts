import type { QuizFact } from "./facts";

export const BASE_FACT_WEIGHT = 1.0;
export const MISSED_FACT_WEIGHT = 1.3;

type DrawNextFactOptions = {
  facts: readonly QuizFact[];
  missedFactKeys?: ReadonlySet<string>;
  previousFactKey?: string;
  random?: () => number;
};

export function getFactWeight(fact: QuizFact, missedFactKeys?: ReadonlySet<string>): number {
  if (!missedFactKeys) {
    return BASE_FACT_WEIGHT;
  }

  return missedFactKeys.has(fact.key) ? MISSED_FACT_WEIGHT : BASE_FACT_WEIGHT;
}

function getCandidates(facts: readonly QuizFact[], previousFactKey?: string): readonly QuizFact[] {
  if (!previousFactKey) {
    return facts;
  }

  const alternatives = facts.filter((fact) => fact.key !== previousFactKey);
  if (alternatives.length > 0) {
    return alternatives;
  }

  return facts;
}

function normalizeRandomValue(randomValue: number): number {
  if (Number.isNaN(randomValue)) {
    return 0;
  }

  if (randomValue < 0) {
    return 0;
  }

  if (randomValue >= 1) {
    return 1 - Number.EPSILON;
  }

  return randomValue;
}

export function drawNextFact({
  facts,
  missedFactKeys,
  previousFactKey,
  random = Math.random,
}: DrawNextFactOptions): QuizFact {
  if (facts.length === 0) {
    throw new Error("facts must not be empty");
  }

  const candidates = getCandidates(facts, previousFactKey);
  const totalWeight = candidates.reduce(
    (sum, fact) => sum + getFactWeight(fact, missedFactKeys),
    0,
  );

  const target = normalizeRandomValue(random()) * totalWeight;
  let cumulativeWeight = 0;

  for (const fact of candidates) {
    cumulativeWeight += getFactWeight(fact, missedFactKeys);
    if (target < cumulativeWeight) {
      return fact;
    }
  }

  return candidates[candidates.length - 1]!;
}
