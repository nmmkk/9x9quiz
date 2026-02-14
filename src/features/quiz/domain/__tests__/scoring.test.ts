import { describe, expect, it } from "vitest";
import { POINTS_PER_CORRECT_ANSWER, applyAnswerScore, scoreFromCorrectAnswers } from "../scoring";

describe("scoring", () => {
  it("awards +10 points for each correct answer", () => {
    expect(POINTS_PER_CORRECT_ANSWER).toBe(10);
    expect(scoreFromCorrectAnswers(0)).toBe(0);
    expect(scoreFromCorrectAnswers(3)).toBe(30);
  });

  it("increments only on correct answers", () => {
    expect(applyAnswerScore(20, true)).toBe(30);
    expect(applyAnswerScore(20, false)).toBe(20);
  });
});
