import {
  defaultLocale,
  fallbackLocale,
  locales,
  messageKeys,
  type Locale,
  type MessageCatalog,
  type MessageKey,
} from "./types";

const jaJPCatalog = {
  "app.title": "くくクイズ",
  "mode.backToTitleButton": "タイトルへ",
  "mode.description": "もんだいすうをえらぶと、すぐにはじめられるよ。",
  "mode.heading": "もんだいすうをえらぼう",
  "mode.highScoreLabel": "さいこうとくてん",
  "mode.listAriaLabel": "もんだいすうのえらびかた",
  "mode.noRecord": "まだきろくなし",
  "mode.optionLabel": "{count}もん",
  "mode.scopeAriaLabel": "れんしゅうはんいのえらびかた",
  "mode.scopeDescription": "れんしゅうしたい だんを えらべるよ。",
  "mode.scopeHeading": "れんしゅうはんい",
  "mode.scopeOptionAll": "1-9のだん",
  "mode.scopeOptionLowerRange": "1-5のだん",
  "mode.scopeOptionUpperRange": "6-9のだん",
  "progress.masteryAriaLabel": "{table}のだん {correct}せいかい / {answered}もん",
  "progress.masteryDescription": "だんごとの せいかいりつを みられるよ。",
  "progress.masteryHeading": "れんしゅう じょうたい",
  "progress.masteryNoAttempts": "まだ",
  "progress.masteryTableLabel": "{table}のだん",
  "progress.masteryValueLabel": "{correct}/{answered} せいかい",
  "quiz.backspaceButton": "けす",
  "quiz.clearButton": "ぜんぶけす",
  "quiz.currentQuestionLabel": "{current}もんめ",
  "quiz.incorrect.correctAnswerLabel": "せいかいは {answer}",
  "quiz.incorrect.enteredLabel": "あなたのこたえは {answer}",
  "quiz.incorrect.nextButton": "つぎへ",
  "quiz.incorrect.title": "おしい!",
  "quiz.numberPadAriaLabel": "すうじボタン",
  "quiz.scoreLabel": "とくてん: {score}",
  "quiz.submitButton": "けってい",
  "result.correctLabel": "せいかい: {correct} / {total}",
  "result.eyebrow": "けっか",
  "result.missedFactReviewButton": "まちがえた{count}もんを ふくしゅう",
  "result.modeHighScoreLabel": "{mode}もんのさいこうとくてん: {score}",
  "result.newHighScoreVariant1": "さいこうとくてん こうしん!",
  "result.newHighScoreVariant2": "やった! さいこうきろく!",
  "result.newHighScoreVariant3": "あたらしい さいこうとくてん!",
  "result.playAgainButton": "もういちど",
  "result.replayEncouragementVariant1": "もういっかい やってみよう!",
  "result.replayEncouragementVariant2": "つぎも がんばろう!",
  "result.replayEncouragementVariant3": "もう1ゲーム しよう!",
  "result.scoreLabel": "とくてん: {score}",
  "result.titleButton": "タイトルへ",
  "title.description": "九九をみじかいクイズで、くりかえしれんしゅうしよう。",
  "title.highScoresButton": "さいこうとくてん",
  "title.modeSelectButton": "もんだいすうをえらぶ",
  "title.quickStartButton": "{count}もんで すぐにはじめる",
  "title.startButton": "はじめる",
} satisfies MessageCatalog;

const enCatalog = {
  "app.title": "Kuku Quiz",
  "mode.backToTitleButton": "Back to Title",
  "mode.description": "Pick a mode to start immediately. High scores are shown when available.",
  "mode.heading": "Choose Question Count",
  "mode.highScoreLabel": "Best Score",
  "mode.listAriaLabel": "Question count modes",
  "mode.noRecord": "No record",
  "mode.optionLabel": "{count} Questions",
  "mode.scopeAriaLabel": "Practice scope options",
  "mode.scopeDescription": "Choose which multiplication tables to focus on.",
  "mode.scopeHeading": "Practice Scope",
  "mode.scopeOptionAll": "Tables 1-9",
  "mode.scopeOptionLowerRange": "Tables 1-5",
  "mode.scopeOptionUpperRange": "Tables 6-9",
  "progress.masteryAriaLabel": "Table {table}: {correct} correct out of {answered}",
  "progress.masteryDescription": "See progress by multiplication table.",
  "progress.masteryHeading": "Mastery",
  "progress.masteryNoAttempts": "Not yet",
  "progress.masteryTableLabel": "Table {table}",
  "progress.masteryValueLabel": "{correct}/{answered} correct",
  "quiz.backspaceButton": "Backspace",
  "quiz.clearButton": "Clear",
  "quiz.currentQuestionLabel": "Question {current}",
  "quiz.incorrect.correctAnswerLabel": "Correct answer: {answer}",
  "quiz.incorrect.enteredLabel": "You entered: {answer}",
  "quiz.incorrect.nextButton": "Next",
  "quiz.incorrect.title": "Not Correct",
  "quiz.numberPadAriaLabel": "On-screen number pad",
  "quiz.scoreLabel": "Points: {score}",
  "quiz.submitButton": "Submit",
  "result.correctLabel": "Correct: {correct} / {total}",
  "result.eyebrow": "Result",
  "result.missedFactReviewButton": "Review {count} Missed Facts",
  "result.modeHighScoreLabel": "Best score for {mode} questions: {score}",
  "result.newHighScoreVariant1": "New Best Score!",
  "result.newHighScoreVariant2": "You Set a New Record!",
  "result.newHighScoreVariant3": "Awesome! New High Score!",
  "result.playAgainButton": "Play Again",
  "result.replayEncouragementVariant1": "Try one more round!",
  "result.replayEncouragementVariant2": "Let's play again!",
  "result.replayEncouragementVariant3": "Keep going, you're improving!",
  "result.scoreLabel": "Points: {score}",
  "result.titleButton": "Title",
  "title.description": "Practice multiplication facts with short, focused quiz rounds.",
  "title.highScoresButton": "Best Score",
  "title.modeSelectButton": "Choose Mode",
  "title.quickStartButton": "Quick Start ({count} Questions)",
  "title.startButton": "Start",
} satisfies MessageCatalog;

const interpolationPattern = /\{(\w+)\}/g;

export const messageCatalogs: Record<Locale, MessageCatalog> = {
  "ja-JP": jaJPCatalog,
  en: enCatalog,
};

function assertCatalogParity(): void {
  const expectedKeys = new Set<string>(messageKeys);

  for (const locale of locales) {
    const catalog = messageCatalogs[locale] as Record<string, string>;

    for (const key of expectedKeys) {
      if (!(key in catalog)) {
        throw new Error(`[i18n] Missing message key "${key}" in locale "${locale}".`);
      }
    }

    for (const key of Object.keys(catalog)) {
      if (!expectedKeys.has(key)) {
        throw new Error(`[i18n] Unexpected message key "${key}" in locale "${locale}".`);
      }
    }
  }
}

assertCatalogParity();

export function formatMessage(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(interpolationPattern, (matchedSegment, key: string) => {
    const value = values[key];
    if (value === undefined) {
      return matchedSegment;
    }

    return String(value);
  });
}

export function getMessage(locale: Locale, key: MessageKey | string): string {
  const localeCatalog = messageCatalogs[locale] as Record<string, string>;
  const fallbackCatalog = messageCatalogs[fallbackLocale] as Record<string, string>;
  const defaultCatalog = messageCatalogs[defaultLocale] as Record<string, string>;

  const localizedMessage = localeCatalog[key];
  if (typeof localizedMessage === "string") {
    return localizedMessage;
  }

  const fallbackMessage = fallbackCatalog[key] ?? defaultCatalog[key];
  if (typeof fallbackMessage === "string") {
    return fallbackMessage;
  }

  if (import.meta.env.DEV) {
    throw new Error(`[i18n] Missing message key "${key}" for locale "${locale}".`);
  }

  return key;
}
