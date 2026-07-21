/**
 * Public URL for an article row (listing cards, search, etc.).
 * @param {{ id: string, slug?: string, lang?: string }} article
 * @param {string} [langOverride] - site language when listing has no per-row lang
 */
export function articlePublicPath(article, langOverride) {
  const lang = langOverride || article?.lang || 'km';
  if (article?.slug) {
    return `/${lang}/articles/${encodeURIComponent(article.slug)}`;
  }
  return `/article/${article.id}`;
}

export function localizedArticleRoute(article, langOverride) {
  const lang = langOverride || article?.lang || 'km';
  if (article?.slug) {
    return {
      name: 'localizedArticle',
      params: { lang, slug: article.slug },
    };
  }
  return {
    name: 'articleDetails',
    params: { id: article.id },
  };
}
