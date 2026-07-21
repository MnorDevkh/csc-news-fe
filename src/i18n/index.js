import { createI18n } from 'vue-i18n';
import km from './locales/km.json';
import en from './locales/en.json';

const STORAGE_KEY = 'csc-site-lang';

function getInitialLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'km' || saved === 'en') return saved;
  } catch {
    /* ignore */
  }
  return 'km';
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'km',
  messages: { km, en },
});

export default i18n;
