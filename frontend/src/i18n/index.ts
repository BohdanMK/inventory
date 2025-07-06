import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import uk from '@/locales/uk.json'

export const i18nInstance = createI18n({
  legacy: false,
  locale: 'uk',
  fallbackLocale: 'uk',
  globalInjection: true,
  messages: {
    en,
    uk,
  },
})

