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
  "app.title": "9x9quiz",
  "mode.backToTitleButton": "タイトルにもどる",
  "mode.description": "モードをえらぶと、すぐにクイズがはじまります。ハイスコアもここで見られます。",
  "mode.eyebrow": "モードせんたく",
  "mode.heading": "もんだいすうをえらぼう",
  "mode.highScoreLabel": "ハイスコア: {score}",
  "mode.listAriaLabel": "もんだいすうモード",
  "mode.noRecord": "きろくなし",
  "mode.optionLabel": "{count}問",
  "quiz.backspaceButton": "けす",
  "quiz.clearButton": "クリア",
  "quiz.eyebrow": "クイズ",
  "quiz.heading": "1もんずつといていこう",
  "quiz.incorrect.correctAnswerLabel": "せいかい: {answer}",
  "quiz.incorrect.enteredLabel": "あなたのこたえ: {answer}",
  "quiz.incorrect.nextButton": "つぎへ",
  "quiz.incorrect.title": "おしい",
  "quiz.numberPadAriaLabel": "がめんキーボード",
  "quiz.scoreLabel": "スコア: {score}",
  "quiz.submitButton": "こたえる",
  "result.correctLabel": "せいかい: {correct} / {total}",
  "result.eyebrow": "けっか",
  "result.heading": "しゅうりょう",
  "result.highScoreUnchanged": "ハイスコアはそのままです。",
  "result.modeHighScoreLabel": "{mode}問モードのハイスコア: {score}",
  "result.newHighScore": "ハイスコアこうしん!",
  "result.playAgainButton": "もういちど",
  "result.scoreLabel": "スコア: {score}",
  "result.titleButton": "タイトル",
  "title.description": "九九のもんだいを、みじかいラウンドでくりかえしれんしゅうしよう。",
  "title.eyebrow": "タイトル",
  "title.highScoresButton": "ハイスコア",
  "title.startButton": "スタート",
} satisfies MessageCatalog;

const enCatalog = {
  "app.title": "9x9quiz",
  "mode.backToTitleButton": "Back to Title",
  "mode.description": "Pick a mode to start immediately. High scores are shown when available.",
  "mode.eyebrow": "Mode Select",
  "mode.heading": "Choose Question Count",
  "mode.highScoreLabel": "High Score: {score}",
  "mode.listAriaLabel": "Question count modes",
  "mode.noRecord": "No record",
  "mode.optionLabel": "{count} Questions",
  "quiz.backspaceButton": "Backspace",
  "quiz.clearButton": "Clear",
  "quiz.eyebrow": "Quiz",
  "quiz.heading": "Solve Each Fact",
  "quiz.incorrect.correctAnswerLabel": "Correct answer: {answer}",
  "quiz.incorrect.enteredLabel": "You entered: {answer}",
  "quiz.incorrect.nextButton": "Next",
  "quiz.incorrect.title": "Not Correct",
  "quiz.numberPadAriaLabel": "On-screen number pad",
  "quiz.scoreLabel": "Score: {score}",
  "quiz.submitButton": "Submit",
  "result.correctLabel": "Correct: {correct} / {total}",
  "result.eyebrow": "Result",
  "result.heading": "Session End",
  "result.highScoreUnchanged": "High score unchanged.",
  "result.modeHighScoreLabel": "Mode {mode} high score: {score}",
  "result.newHighScore": "New High Score!",
  "result.playAgainButton": "Play Again",
  "result.scoreLabel": "Score: {score}",
  "result.titleButton": "Title",
  "title.description": "Practice multiplication facts with short, focused quiz rounds.",
  "title.eyebrow": "Title",
  "title.highScoresButton": "High Scores",
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
