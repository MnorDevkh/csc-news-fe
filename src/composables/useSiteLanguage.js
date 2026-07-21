import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const STORAGE_KEY = 'csc-site-lang';

/**
 * Site language (km | en) — drives content filtering and vue-i18n locale.
 * Persisted to localStorage.
 */
export function useSiteLanguage() {
  const { locale } = useI18n();

  const lang = computed({
    get: () => (locale.value === 'en' ? 'en' : 'km'),
    set: (value) => {
      const next = value === 'en' ? 'en' : 'km';
      locale.value = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
    },
  });

  function setLang(value) {
    lang.value = value;
  }

  function toggleLang() {
    setLang(lang.value === 'km' ? 'en' : 'km');
  }

  const oppositeLang = computed(() => (lang.value === 'km' ? 'en' : 'km'));

  return {
    lang,
    oppositeLang,
    setLang,
    toggleLang,
  };
}
