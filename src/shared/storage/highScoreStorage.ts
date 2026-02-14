export type QuestionCountMode = 10 | 20 | 30;

export const questionCountModes: readonly QuestionCountMode[] = [10, 20, 30];

function getHighScoreStorageKey(mode: QuestionCountMode): string {
  return `9x9quiz.v1.highScore.${mode}`;
}

function getLocalStorage(): Storage | null {
  if (typeof globalThis.localStorage === "undefined") {
    return null;
  }

  return globalThis.localStorage;
}

export function readHighScore(mode: QuestionCountMode): number | null {
  const storage = getLocalStorage();
  if (!storage) {
    return null;
  }

  const rawScore = storage.getItem(getHighScoreStorageKey(mode));
  if (rawScore === null) {
    return null;
  }

  const score = Number(rawScore);
  if (!Number.isFinite(score) || score < 0) {
    return null;
  }

  return Math.floor(score);
}

export type HighScoreUpdateResult = {
  previousHighScore: number | null;
  highScore: number;
  isNewHighScore: boolean;
};

export function updateHighScore(mode: QuestionCountMode, score: number): HighScoreUpdateResult {
  const normalizedScore = Math.max(0, Math.floor(score));
  const previousHighScore = readHighScore(mode);
  const storage = getLocalStorage();

  if (previousHighScore === null || normalizedScore > previousHighScore) {
    storage?.setItem(getHighScoreStorageKey(mode), String(normalizedScore));

    return {
      previousHighScore,
      highScore: normalizedScore,
      isNewHighScore: true,
    };
  }

  return {
    previousHighScore,
    highScore: previousHighScore,
    isNewHighScore: false,
  };
}
