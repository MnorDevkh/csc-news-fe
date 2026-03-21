/**
 * Bible language is stored as a comma-separated string (e.g. "km", "km, en").
 */

export function parseLanguageCodes(languageStr) {
  if (!languageStr || !String(languageStr).trim()) {
    return { km: true, en: false };
  }
  const parts = String(languageStr)
    .split(/[,|]/)
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
  return {
    km: parts.some((p) => p === 'km' || p === 'khmer'),
    en: parts.some((p) => p === 'en' || p === 'eng' || p === 'english'),
  };
}

export function serializeLanguageCodes({ km, en }) {
  const parts = [];
  if (km) parts.push('km');
  if (en) parts.push('en');
  return parts.length ? parts.join(', ') : 'km';
}

/** Client-side filter for admin dropdowns: which bible languages to show */
export function bibleMatchesLanguageFilter(bible, { km, en }) {
  if (!km && !en) return true;
  const raw = bible?.language;
  const lang = (raw || '').toLowerCase();
  const hasKm = lang.includes('km') || (!raw && km);
  const hasEn = lang.includes('en');
  if (km && en) return hasKm || hasEn;
  if (km) return hasKm;
  if (en) return hasEn;
  return true;
}

export function chapterMatchesLanguageFilter(chapter, sel) {
  return bibleMatchesLanguageFilter(chapter?.bible, sel);
}
