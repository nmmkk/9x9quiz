import {
  defaultPracticeScope,
  getPracticeScopeTables,
  normalizePracticeScope,
  type PracticeScope,
} from "./practiceScope";

export const FACT_RANGE_START = 1;
export const FACT_RANGE_END = 9;

export type QuizFact = {
  left: number;
  right: number;
  answer: number;
  key: string;
};

export function toFactKey(left: number, right: number): string {
  return `${left}x${right}`;
}

type CreateFactPoolOptions = {
  practiceScope?: PracticeScope;
};

export function createFactPool({ practiceScope = defaultPracticeScope }: CreateFactPoolOptions = {}): QuizFact[] {
  const facts: QuizFact[] = [];
  const normalizedScope = normalizePracticeScope(practiceScope);
  const selectedTables = new Set(getPracticeScopeTables(normalizedScope));

  for (let left = FACT_RANGE_START; left <= FACT_RANGE_END; left += 1) {
    if (!selectedTables.has(left)) {
      continue;
    }

    for (let right = FACT_RANGE_START; right <= FACT_RANGE_END; right += 1) {
      facts.push({
        left,
        right,
        answer: left * right,
        key: toFactKey(left, right),
      });
    }
  }

  return facts;
}

export function isAnswerCorrect(fact: QuizFact, submittedAnswer: number): boolean {
  return fact.answer === submittedAnswer;
}
