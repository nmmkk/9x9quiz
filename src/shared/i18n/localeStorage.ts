import { defaultLocale, isLocale, type Locale } from "./types";

export const localeStorageKey = "9x9quiz.v1.locale";

function getLocalStorage(): Storage | null {
  if (typeof globalThis.localStorage === "undefined") {
    return null;
  }

  return globalThis.localStorage;
}

export function readStoredLocale(): Locale {
  const storage = getLocalStorage();
  if (!storage) {
    return defaultLocale;
  }

  const storedLocale = storage.getItem(localeStorageKey);
  if (!storedLocale || !isLocale(storedLocale)) {
    return defaultLocale;
  }

  return storedLocale;
}

export function writeStoredLocale(locale: Locale): void {
  getLocalStorage()?.setItem(localeStorageKey, locale);
}
