import en, { type Dictionary } from './en';
import tr from './tr';
import es from './es';

export const locales = ['en', 'tr', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const dictionaries: Record<Locale, Dictionary> = { en, tr, es };

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  tr: 'TR',
  es: 'ES',
};

export const localeNames: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe',
  es: 'Español',
};

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export type { Dictionary };
