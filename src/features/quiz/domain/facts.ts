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

export function createFactPool(): QuizFact[] {
  const facts: QuizFact[] = [];

  for (let left = FACT_RANGE_START; left <= FACT_RANGE_END; left += 1) {
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
