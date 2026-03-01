import {
  normalizePracticeScope,
  parsePracticeScope,
  type PracticeScope,
} from "../../features/quiz/domain/practiceScope";

const practiceScopeStorageKey = "9x9quiz.v1.practiceScope";

function getLocalStorage(): Storage | null {
  if (typeof globalThis.localStorage === "undefined") {
    return null;
  }

  return globalThis.localStorage;
}

export function readPracticeScope(): PracticeScope | null {
  const storage = getLocalStorage();
  if (!storage) {
    return null;
  }

  const rawScope = storage.getItem(practiceScopeStorageKey);
  if (rawScope === null) {
    return null;
  }

  try {
    return parsePracticeScope(JSON.parse(rawScope));
  } catch {
    return null;
  }
}

export function writePracticeScope(scope: PracticeScope): void {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  storage.setItem(practiceScopeStorageKey, JSON.stringify(normalizePracticeScope(scope)));
}

export function clearPracticeScope(): void {
  const storage = getLocalStorage();
  storage?.removeItem(practiceScopeStorageKey);
}
