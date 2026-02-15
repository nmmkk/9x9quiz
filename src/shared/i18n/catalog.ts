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
} satisfies MessageCatalog;

const enCatalog = {
  "app.title": "9x9quiz",
} satisfies MessageCatalog;

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
