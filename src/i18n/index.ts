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

/** Update all HTML elements outside the canvas that have data-i18n or data-i18n-html attributes */
export function updateHtmlTranslations(): void {
  // Elements using textContent (newlines in translation become <br>)
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const translated = t(key);
      // Replace \n with <br> for HTML rendering
      el.innerHTML = translated.replace(/\n/g, '<br>');
    }
  });
  // Elements using innerHTML (newlines in translation become <br>)
  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (key) {
      const translated = t(key);
      el.innerHTML = translated.replace(/\n/g, '<br>');
    }
  });
  // Update the html lang attribute
  document.documentElement.lang = i18next.language;
}

/** Change the current language and update all translations (canvas + HTML) */
export function changeLanguage(lang: string): void {
  i18next.changeLanguage(lang);
  updateHtmlTranslations();
}

/** Get the current language */
export function getCurrentLanguage(): string {
  return i18next.language;
}

export default i18next;
