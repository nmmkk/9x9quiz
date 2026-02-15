export const locales = ["ja-JP", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ja-JP";
export const fallbackLocale: Locale = "en";

export const messageKeys = ["app.title"] as const;

export type MessageKey = (typeof messageKeys)[number];

export type MessageCatalog = Record<MessageKey, string>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
