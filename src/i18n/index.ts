import i18next from 'i18next';
import es from './es.json';
import en from './en.json';
import { valentineConfig } from '../config/valentine.config';

const resources = {
  es: { translation: es },
  en: { translation: en },
};

export async function initI18n(): Promise<typeof i18next> {
  await i18next.init({
    lng: valentineConfig.defaultLanguage,
    fallbackLng: 'es',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });
  return i18next;
}

/** Get a translated string, replacing {nickname} with the configured nickname */
export function t(key: string, options?: Record<string, unknown>): string {
  const result = i18next.t(key, options);
  if (typeof result === 'string') {
    return result.replace(/\{nickname\}/g, valentineConfig.nickname);
  }
  return String(result);
}

/** Get an array of translated strings (for story sequences) */
export function tArray(key: string): string[] {
  const result = i18next.t(key, { returnObjects: true });
  if (Array.isArray(result)) {
    return result.map((s: unknown) =>
      String(s).replace(/\{nickname\}/g, valentineConfig.nickname)
    );
  }
  return [String(result)];
}

/** Change the current language */
export function changeLanguage(lang: string): void {
  i18next.changeLanguage(lang);
}

/** Get the current language */
export function getCurrentLanguage(): string {
  return i18next.language;
}

export default i18next;
