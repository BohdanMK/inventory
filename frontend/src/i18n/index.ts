import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import uk from '@/locales/uk.json';

export const i18nInstance = createI18n({
  legacy: false,
  locale: localStorage.getItem('selectedLang') || import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  globalInjection: true,
  messages: {
    en,
    uk,
  },
});
