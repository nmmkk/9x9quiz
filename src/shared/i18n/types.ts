export const locales = ["ja-JP", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ja-JP";
export const fallbackLocale: Locale = "en";

export const messageKeys = [
  "app.title",
  "app.updateNotice",
  "app.updateButton",
  "mode.backToTitleButton",
  "mode.description",
  "mode.heading",
  "mode.highScoreLabel",
  "mode.listAriaLabel",
  "mode.noRecord",
  "mode.optionLabel",
  "mode.resetProgressButton",
  "mode.resetProgressConfirm",
  "mode.scopeAriaLabel",
  "mode.scopeDescription",
  "mode.scopeHeading",
  "mode.scopeOptionAll",
  "mode.scopeOptionLowerRange",
  "mode.scopeOptionUpperRange",
  "progress.masteryAriaLabel",
  "progress.masteryDescription",
  "progress.masteryHeading",
  "progress.masteryNoAttempts",
  "progress.masteryPracticeButton",
  "progress.masteryTableLabel",
  "progress.masteryValueLabel",
  "quiz.backspaceButton",
  "quiz.clearButton",
  "quiz.currentQuestionLabel",
  "quiz.incorrect.correctAnswerLabel",
  "quiz.incorrect.enteredLabel",
  "quiz.incorrect.nextButton",
  "quiz.incorrect.title",
  "quiz.numberPadAriaLabel",
  "quiz.progressAriaLabel",
  "quiz.progressLabel",
  "quiz.scoreLabel",
  "quiz.submitButton",
  "result.correctLabel",
  "result.eyebrow",
  "result.missedFactReviewButton",
  "result.modeHighScoreLabel",
  "result.newHighScoreVariant1",
  "result.newHighScoreVariant2",
  "result.newHighScoreVariant3",
  "result.playAgainButton",
  "result.replayEncouragementVariant1",
  "result.replayEncouragementVariant2",
  "result.replayEncouragementVariant3",
  "result.scoreLabel",
  "result.titleButton",
  "title.description",
  "title.highScoresButton",
  "title.installButton",
  "title.modeSelectButton",
  "title.quickStartButton",
  "title.startButton",
] as const;

export type MessageKey = (typeof messageKeys)[number];

export type MessageCatalog = Record<MessageKey, string>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
