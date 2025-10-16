import type { Ref, ComputedRef } from 'vue';

interface LanguageMessages {
  [key: string]: string | LanguageMessages;
}

type Translation = (path: string, options?: LanguageMessages) => ComputedRef<string>;

interface I18n {
  locale: Ref<string>;
  language: Ref<LanguageMessages>;
  t: Translation;
  setLocale: (locale: string) => void;
}
