export const locales = ["ja-JP", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ja-JP";
export const fallbackLocale: Locale = "en";

export const messageKeys = [
  "app.title",
  "mode.backToTitleButton",
  "mode.description",
  "mode.eyebrow",
  "mode.heading",
  "mode.highScoreLabel",
  "mode.listAriaLabel",
  "mode.noRecord",
  "mode.optionLabel",
  "quiz.backspaceButton",
  "quiz.clearButton",
  "quiz.eyebrow",
  "quiz.heading",
  "quiz.incorrect.correctAnswerLabel",
  "quiz.incorrect.enteredLabel",
  "quiz.incorrect.nextButton",
  "quiz.incorrect.title",
  "quiz.numberPadAriaLabel",
  "quiz.scoreLabel",
  "quiz.submitButton",
  "result.correctLabel",
  "result.eyebrow",
  "result.heading",
  "result.highScoreUnchanged",
  "result.modeHighScoreLabel",
  "result.newHighScore",
  "result.playAgainButton",
  "result.scoreLabel",
  "result.titleButton",
  "title.description",
  "title.eyebrow",
  "title.highScoresButton",
  "title.startButton",
] as const;

export type MessageKey = (typeof messageKeys)[number];

export type MessageCatalog = Record<MessageKey, string>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
