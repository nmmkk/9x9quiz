export const POINTS_PER_CORRECT_ANSWER = 10;

export function scoreFromCorrectAnswers(correctAnswers: number): number {
  return correctAnswers * POINTS_PER_CORRECT_ANSWER;
}

export function applyAnswerScore(currentScore: number, isCorrect: boolean): number {
  if (!isCorrect) {
    return currentScore;
  }

  return currentScore + POINTS_PER_CORRECT_ANSWER;
}
