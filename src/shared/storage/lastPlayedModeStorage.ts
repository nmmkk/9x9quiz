import { questionCountModes, type QuestionCountMode } from "./highScoreStorage";

const lastPlayedModeStorageKey = "9x9quiz.v1.lastPlayedMode";

function getLocalStorage(): Storage | null {
  if (typeof globalThis.localStorage === "undefined") {
    return null;
  }

  return globalThis.localStorage;
}

export function readLastPlayedMode(): QuestionCountMode | null {
  const storage = getLocalStorage();
  if (!storage) {
    return null;
  }

  const rawMode = storage.getItem(lastPlayedModeStorageKey);
  if (rawMode === null) {
    return null;
  }

  const parsedMode = Number(rawMode);
  if (!Number.isInteger(parsedMode)) {
    return null;
  }

  if (!questionCountModes.includes(parsedMode as QuestionCountMode)) {
    return null;
  }

  return parsedMode as QuestionCountMode;
}

export function writeLastPlayedMode(mode: QuestionCountMode): void {
  const storage = getLocalStorage();
  storage?.setItem(lastPlayedModeStorageKey, String(mode));
}
