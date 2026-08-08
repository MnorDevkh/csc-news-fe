<script setup>
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { NewsService } from '@/services/NewsService';
import { CategoryService } from '@/services/CategoryService';
import { useSiteLanguage } from '@/composables/useSiteLanguage';
import { articlePublicPath } from '@/utils/articleRoutes';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { lang, setLang } = useSiteLanguage();

// Optional ?lang= query, e.g. /category/tesk-km?lang=en
const queryLang = computed(() => {
  const q = String(route.query.lang || '').toLowerCase();
  return q === 'en' || q === 'km' ? q : null;
});

const categoryName = ref('');
const categorySlug = ref('');
const currentCategory = ref(null);
const groupTranslations = ref([]);
const articles = ref([]);
const isLoading = ref(true);
const hasError = ref(false);
/** Skip the first lang-watch tick after a category load (avoids fighting setLang sync). */
let suppressLangNav = false;

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

async function loadTranslations(categoryId) {
  try {
    const rows = await CategoryService.getTranslations(categoryId);
    groupTranslations.value = Array.isArray(rows) ? rows : [];
  } catch (e) {
    console.warn('Could not load category translations:', e);
    groupTranslations.value = [];
  }
}

async function fetchArticlesByCategory() {
  const slug = route.params.name;
  if (!slug) {
    articles.value = [];
    categoryName.value = 'All';
    currentCategory.value = null;
    groupTranslations.value = [];
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  hasError.value = false;
  categorySlug.value = slug;

  try {
    // Resolve by slug across languages — each translation has its own slug.
    const allCats = await CategoryService.getAllCategories();
    let category = Array.isArray(allCats)
      ? allCats.find((c) => c.slug === slug)
      : null;

    if (!category) {
      categoryName.value = slug;
      currentCategory.value = null;
      groupTranslations.value = [];
      articles.value = [];
      return;
    }

    currentCategory.value = category;
    categoryName.value = category.name;

    // Keep site UI language in sync with the category being viewed.
    const catLang = category.lang || 'km';
    if (catLang !== lang.value) {
      suppressLangNav = true;
      setLang(catLang);
    }

    await loadTranslations(category.id);

    const data = await NewsService.getArticlesByCategory(category.id, {
      skip: 0,
      limit: 50,
    });

    const items = data.items ?? data ?? [];
    articles.value = items.map((a) => ({
      id: a.id,
      slug: a.slug,
      lang: a.lang,
      title: a.title,
      snippet: a.excerpt ?? a.snippet ?? '',
      date: a.publish_at ?? a.published_at ?? a.date ?? '',
      image: a.thumbnail ?? a.image ?? null,
      categories: a.categories ?? (a.category ? [a.category] : []),
    }));
  } catch (err) {
    console.error('Failed to load category articles:', err);
    hasError.value = true;
    articles.value = [];
  } finally {
    isLoading.value = false;
  }
}

// Reload when the category slug (or optional ?lang=) changes — not on every site-lang toggle.
let lastLoadKey = '';
watch(
  () => [route.params.name, route.query.lang],
  () => {
    if (queryLang.value && queryLang.value !== lang.value) {
      suppressLangNav = true;
      setLang(queryLang.value);
    }
    const key = String(route.params.name || '');
    if (key === lastLoadKey) return;
    lastLoadKey = key;
    fetchArticlesByCategory();
  },
  { immediate: true }
);

/**
 * Header language switcher: go to the paired category slug, or home if none.
 * Example: /category/khmer-category + EN → /category/english-category
 */
watch(lang, (newLang) => {
  if (route.name !== 'categoryView') return;
  if (suppressLangNav) {
    suppressLangNav = false;
    return;
  }
  if (!currentCategory.value || isLoading.value) return;

  const currentLang = currentCategory.value.lang || 'km';
  if (newLang === currentLang) return;

  const sibling = (groupTranslations.value || []).find(
    (tr) => tr.lang === newLang && tr.slug && String(tr.id) !== String(currentCategory.value.id)
  );

  if (sibling?.slug) {
    lastLoadKey = ''; // allow fetch for the new slug
    router.push({ name: 'categoryView', params: { name: sibling.slug } });
  } else {
    router.push({ name: 'home' });
  }
});
</script>

<template>
  <div class="w-full min-h-0 flex justify-center items-start py-2 box-border">
    <div class="w-full panel p-4 sm:p-6 lg:p-8">
      <h1 class="mb-6 text-2xl sm:text-3xl font-bold text-[#1a365d] relative pb-3">
        {{ t('category.title', { name: categoryName }) }}
        <span class="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#d4a853] to-transparent rounded-full"></span>
      </h1>

      <div v-if="isLoading" class="space-y-4 animate-pulse">
        <div v-for="i in 3" :key="i" class="flex flex-col sm:flex-row gap-6 rounded-md border border-gray-100 p-4">
          <div class="w-full sm:w-48 h-32 sm:h-32 bg-gray-200 rounded-md flex-shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-5 bg-gray-200 rounded w-3/4" />
            <div class="h-4 bg-gray-200 rounded w-full" />
            <div class="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>

      <div v-else-if="hasError" class="text-center py-16 text-red-500">
        {{ t('category.loadingError') }}
      </div>

      <div v-else-if="articles.length === 0" class="text-center py-16 text-gray-400">
        {{ t('category.noArticles') }}
      </div>

      <div v-else class="space-y-4">
        <RouterLink
          v-for="article in articles"
          :key="article.id"
          :to="articlePublicPath(article, article.lang || lang)"
          class="flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-md border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all group"
        >
          <div
            v-if="article.image"
            class="w-full sm:w-48 h-40 sm:h-32 rounded-md overflow-hidden flex-shrink-0 bg-gray-100"
          >
            <img
              :src="article.image"
              :alt="article.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div class="flex-1 min-w-0 flex flex-col justify-center">
            <h2 class="text-lg font-bold text-[#1a365d] group-hover:text-[#d4a853] transition-colors mb-1 line-clamp-2">
              {{ article.title }}
            </h2>
            <p v-if="article.snippet" class="text-sm text-gray-500 line-clamp-2 mb-2">
              {{ article.snippet }}
            </p>
            <div class="flex items-center gap-2 text-xs text-gray-400">
              <span v-if="article.date">{{ formatDate(article.date) }}</span>
              <template v-if="article.categories?.length">
                <span>·</span>
                <span>{{ article.categories.map((c) => c.name).join(', ') }}</span>
              </template>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
