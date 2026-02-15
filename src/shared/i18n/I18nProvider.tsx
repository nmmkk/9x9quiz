import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatMessage, getMessage } from "./catalog";
import { readStoredLocale, writeStoredLocale } from "./localeStorage";
import { type Locale, type MessageKey } from "./types";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
  tf: (key: MessageKey, values: Record<string, string | number>) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(() => readStoredLocale());

  useEffect(() => {
    writeStoredLocale(locale);

    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const t = useCallback((key: MessageKey) => getMessage(locale, key), [locale]);
  const tf = useCallback(
    (key: MessageKey, values: Record<string, string | number>) => {
      const template = getMessage(locale, key);
      return formatMessage(template, values);
    },
    [locale],
  );
  const contextValue = useMemo(() => ({ locale, setLocale, t, tf }), [locale, t, tf]);

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}
