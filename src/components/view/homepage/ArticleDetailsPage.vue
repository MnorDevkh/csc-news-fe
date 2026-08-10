<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ShareAltOutlined,
  CalendarOutlined,
  TagOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue';
import { NewsService } from '@/services/NewsService.js';
import { useI18n } from 'vue-i18n';
import { useSiteLanguage } from '@/composables/useSiteLanguage';
import { localizedArticleRoute } from '@/utils/articleRoutes';
import ArticleCommentsSection from './ArticleCommentsSection.vue';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { lang: siteLang, setLang } = useSiteLanguage();

const article = ref(null);
const groupTranslations = ref([]);
const isLoading = ref(true);
const hasError = ref(false);
const notFound = ref(false);
const shareCopied = ref(false);
const readProgress = ref(0);
const recommended = ref([]);
const isLoadingRecommended = ref(false);
/** Skip lang-watch after syncing site lang from a loaded article (matches category pages). */
let suppressLangNav = false;

let seoNodes = [];

const isLocalizedRoute = computed(() => route.name === 'localizedArticle');

const otherTranslations = computed(() => {
  const list = groupTranslations.value?.length
    ? groupTranslations.value
    : (article.value?.translations || []);
  if (!list.length) return [];
  const currentLang = article.value?.lang || route.params.lang || 'km';
  const currentId = article.value?.id;
  return list.filter(
    (t) => t.lang !== currentLang && t.slug && String(t.id) !== String(currentId)
  );
});

function languageLabel(code) {
  if (code === 'en') return t('lang.english');
  if (code === 'km') return t('lang.km');
  return code?.toUpperCase?.() || code;
}

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const articleCategories = computed(() => {
  const a = article.value;
  if (!a) return [];
  if (Array.isArray(a.categories) && a.categories.length) return a.categories;
  if (a.category) return [a.category];
  return [];
});

const shareLabel = computed(() => (shareCopied.value ? t('article.linkCopied') : t('article.share')));

/** Parse article.content: if JSON array of blocks return blocks, else return null (legacy HTML). */
function parseContentBlocks(content) {
  if (!content || !content.trim()) return null;
  const s = content.trim();
  if (!s.startsWith('[') || !s.endsWith(']')) return null;
  try {
    const arr = JSON.parse(content);
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const validTypes = new Set(['text', 'image', 'mixed', 'gallery']);
    const hasValidType = arr.every((b) => b && typeof b === 'object' && validTypes.has(b.type));
    return hasValidType ? arr : null;
  } catch {
    return null;
  }
}

const contentBlocks = computed(() => {
  if (!article.value || !article.value.content) return null;
  return parseContentBlocks(article.value.content);
});

const GALLERY_SINGLE_H = '520px';
const GALLERY_MULTI_H = '340px';
const GALLERY_GRID_GAP = '0.375rem';

/** Container style per image count */
function galleryContainerStyle(count) {
  if (count <= 1)
    return `display:flex; gap:0;`;
  if (count === 2)
    return `display:flex; gap:${GALLERY_GRID_GAP}; align-items:stretch;`;
  // 3 and 4: 2-column grid
  return `display:grid; grid-template-columns:1fr 1fr; gap:${GALLERY_GRID_GAP};`;
}

/**
 * Per-image style based on (count, index).
 * - count 1          : single full-width contain
 * - count 2          : flex item, equal height, natural width
 * - count 3, idx 0-1 : 4:3 grid cell
 * - count 3, idx 2   : spans both columns (full width), 16:9
 * - count 4          : 1:1 square grid cell
 */
function galleryItemStyleAt(count, index) {
  // Single image: natural size — no crop, no white space, no fixed height
  if (count <= 1)
    return `width:100%; height:auto; display:block; border-radius:0.2rem;`;
  // 2 images: flex with natural width → no white space, no crop
  if (count === 2)
    return `height:${GALLERY_MULTI_H}; width:auto; flex:1 1 auto; min-width:60px; object-fit:contain; background:#f5f7fa; border-radius:0.2rem;`;

  // Grid cells (3+): use cover to fill cell — no white space
  const cover = 'object-fit:cover; width:100%; border-radius:0.2rem;';
  if (count === 3 && index === 2)
    return `${cover} grid-column:1 / -1; aspect-ratio:16/9;`;
  if (count === 3)
    return `${cover} aspect-ratio:4/3;`;
  if (count === 4)
    return `${cover} aspect-ratio:1/1;`;
  // count 5+ — last item full width if odd
  const isLastOdd = count % 2 !== 0 && index === count - 1;
  if (isLastOdd)
    return `${cover} grid-column:1 / -1; aspect-ratio:16/9;`;
  return `${cover} aspect-ratio:1/1;`;
}

/* ─── Lightbox ─────────────────────────────────────────────────── */
const lightboxUrls = ref([]);
const lightboxIndex = ref(0);
const lightboxOpen = ref(false);

function openLightbox(urls, index = 0) {
  lightboxUrls.value = urls;
  lightboxIndex.value = index;
  lightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxOpen.value = false;
  document.body.style.overflow = '';
}

function lightboxPrev() {
  lightboxIndex.value = (lightboxIndex.value - 1 + lightboxUrls.value.length) % lightboxUrls.value.length;
}

function lightboxNext() {
  lightboxIndex.value = (lightboxIndex.value + 1) % lightboxUrls.value.length;
}

function onLightboxKey(e) {
  if (!lightboxOpen.value) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev();
  if (e.key === 'ArrowRight') lightboxNext();
}

function syncTranslations(data) {
  const siblings = Array.isArray(data?.translations) ? data.translations : [];
  // Include current row so language switch can resolve any pair consistently.
  const self = data?.id
    ? [{
        id: data.id,
        lang: data.lang || 'km',
        slug: data.slug,
        title: data.title,
        effective_status: data.effective_status || data.status,
      }]
    : [];
  const byLang = new Map();
  for (const row of [...self, ...siblings]) {
    if (row?.lang) byLang.set(row.lang, row);
  }
  groupTranslations.value = Array.from(byLang.values());
}

async function loadArticle() {
  isLoading.value = true;
  hasError.value = false;
  notFound.value = false;
  article.value = null;
  groupTranslations.value = [];
  try {
    let data;
    if (isLocalizedRoute.value) {
      data = await NewsService.getArticleBySlug(route.params.lang, route.params.slug);
      const nextLang = data.lang || route.params.lang;
      if (nextLang && nextLang !== siteLang.value) {
        suppressLangNav = true;
        setLang(nextLang);
      }
    } else {
      data = await NewsService.getArticleById(route.params.id);
      if (data?.slug && data?.lang) {
        await router.replace(
          localizedArticleRoute(data)
        );
        return;
      }
    }
    article.value = data;
    syncTranslations(data);
    applySeo(data);
  } catch (error) {
    console.error('Failed to load article:', error);
    article.value = null;
    groupTranslations.value = [];
    if (error?.response?.status === 404) {
      notFound.value = true;
    } else {
      hasError.value = true;
    }
    clearSeo();
  } finally {
    isLoading.value = false;
  }
}

function clearSeo() {
  seoNodes.forEach((node) => node.remove());
  seoNodes = [];
}

function applySeo(data) {
  clearSeo();
  if (!data || typeof document === 'undefined') return;

  const title = data.meta_title || data.title || 'Article';
  document.title = title;

  const head = document.head;
  const desc = data.meta_description || data.excerpt || '';
  if (desc) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      head.appendChild(meta);
      seoNodes.push(meta);
    }
    meta.setAttribute('content', desc);
  }

  const origin = window.location.origin;
  const canonicalHref = data.slug && data.lang
    ? `${origin}/${data.lang}/articles/${encodeURIComponent(data.slug)}`
    : window.location.href;

  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = canonicalHref;
  head.appendChild(canonical);
  seoNodes.push(canonical);

  const allLinks = [
    { lang: data.lang, slug: data.slug },
    ...(data.translations || []),
  ].filter((t) => t.slug);

  for (const t of allLinks) {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = t.lang;
    link.href = `${origin}/${t.lang}/articles/${encodeURIComponent(t.slug)}`;
    head.appendChild(link);
    seoNodes.push(link);
  }
}

function switchLanguage(translation) {
  if (!translation?.slug) return;
  suppressLangNav = true;
  setLang(translation.lang);
  router.push({
    name: 'localizedArticle',
    params: { lang: translation.lang, slug: translation.slug },
  });
}

/**
 * Header language switcher: go to the paired article URL, or home if none.
 * Example: /km/articles/khmer-slug + EN → /en/articles/english-slug
 */
function navigateForLanguage(newLang) {
  if (route.name !== 'localizedArticle' && route.name !== 'articleDetails') return;
  if (suppressLangNav) {
    suppressLangNav = false;
    return;
  }
  if (!article.value || isLoading.value) return;

  const currentLang = article.value.lang || 'km';
  if (newLang === currentLang) return;

  const sibling = (groupTranslations.value || []).find(
    (tr) => tr.lang === newLang && tr.slug && String(tr.id) !== String(article.value.id)
  );

  if (sibling?.slug) {
    router.push({
      name: 'localizedArticle',
      params: { lang: sibling.lang, slug: sibling.slug },
    });
  } else {
    router.push({ name: 'home' });
  }
}

async function loadRecommended() {
  isLoadingRecommended.value = true;
  try {
    const items = await NewsService.getFeaturedArticles(article.value?.lang || siteLang.value);
    const currentId = String(article.value?.id || route.params.id || '');
    recommended.value = (items || [])
      .filter((x) => String(x?.id) !== currentId)
      .slice(0, 5);
  } catch (error) {
    console.error('Failed to load recommended articles:', error);
    recommended.value = [];
  } finally {
    isLoadingRecommended.value = false;
  }
}

function updateReadProgress() {
  const el = document.documentElement;
  const scrollTop = el.scrollTop || document.body.scrollTop;
  const scrollHeight = el.scrollHeight - el.clientHeight;
  readProgress.value = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0;
}

async function handleShare() {
  const url = window.location.href;
  const title = article.value?.title ?? document.title;
  const text = article.value?.excerpt ?? '';

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    shareCopied.value = true;
    setTimeout(() => { shareCopied.value = false; }, 2000);
  } catch {
    // fallback: no copy, no share
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateReadProgress, { passive: true });
  window.addEventListener('keydown', onLightboxKey);
});

watch(
  () => [route.name, route.params.id, route.params.lang, route.params.slug],
  () => {
    if (route.name === 'localizedArticle' || route.name === 'articleDetails') {
      loadArticle();
      loadRecommended();
    }
  },
  { immediate: true }
);

watch(siteLang, (newLang) => {
  navigateForLanguage(newLang);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadProgress);
  window.removeEventListener('keydown', onLightboxKey);
  document.body.style.overflow = '';
  clearSeo();
});
</script>

<template>
  <div class="w-full article-details min-h-screen bg-[#f8f9fa] flex items-center justify-center">
    <!-- Reading progress bar -->
    <div v-if="article" class="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-10 " aria-hidden="true">
      <div class="h-full bg-gradient-to-r from-[#4165d1] to-[#e02838] transition-[width] duration-150"
        :style="{ width: readProgress + '%' }" />
    </div>

    <div class="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="py-10 sm:py-16">
        <div class="max-w-[720px] mx-auto text-center mb-10 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-36 mx-auto mb-6" />
          <div class="h-10 bg-gray-200 rounded w-4/5 mx-auto mb-6" />
          <div class="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
        </div>
        <div class="w-full h-[320px] sm:h-[520px] bg-gray-200 rounded-md animate-pulse mb-10" />
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16">
          <div class="hidden lg:block lg:col-span-1">
            <div class="h-40 bg-gray-200 rounded-md animate-pulse" />
          </div>
          <div class="lg:col-span-7 lg:col-start-2">
            <div class="max-w-[720px] space-y-4 animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-full" />
              <div class="h-4 bg-gray-200 rounded w-11/12" />
              <div class="h-4 bg-gray-200 rounded w-10/12" />
              <div class="h-4 bg-gray-200 rounded w-9/12" />
            </div>
          </div>
          <div class="hidden lg:block lg:col-span-3 lg:col-start-10">
            <div class="h-64 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="notFound" class="py-12 sm:py-16">
        <div class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 sm:p-10 md:p-12 text-center max-w-3xl mx-auto">
          <p class="text-gray-700 text-lg font-medium mb-2">{{ t('article.notFound') }}</p>
          <p class="text-gray-500 text-sm mb-6">{{ t('article.notAvailableLang') }}</p>
          <router-link to="/" class="text-[#4165d1] font-medium hover:underline">{{ t('article.backToHome') }}</router-link>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="py-12 sm:py-16">
        <div class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 sm:p-10 md:p-12 text-center max-w-3xl mx-auto">
          <ExclamationCircleOutlined class="text-5xl text-gray-300 mb-4 block mx-auto" aria-hidden="true" />
          <p class="text-gray-700 text-lg font-medium mb-2">{{ t('article.loadFailed') }}</p>
          <p class="text-gray-500 text-sm mb-6">{{ t('article.connectionFailed') }}</p>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <button type="button" @click="loadArticle"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4165d1]/20 focus:ring-offset-2">
              <ReloadOutlined /> {{ t('common.retry') }}
            </button>
            <button type="button" @click="router.back()"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4165d1] text-white text-sm font-medium rounded-md hover:bg-[#3554b8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4165d1]/30 focus:ring-offset-2 shadow-sm">
              <ArrowLeftOutlined /> {{ t('article.goBack') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Article -->
      <div v-else-if="article">
        <div class="max-w-[1200px] mx-auto">
          <!-- Header (centered, like static) -->
          <header class="py-10 sm:py-16">
            <div class="max-w-[1020px] mx-auto text-center">
              <div v-if="articleCategories.length" class="flex justify-center mb-6">
                <span v-for="cat in articleCategories" :key="cat.id || cat.slug || cat.name"
                  class="inline-flex items-center gap-1.5 bg-white text-[#4165d1] px-3 py-1 text-xs sm:text-sm uppercase tracking-widest rounded-full ring-1 ring-gray-200 shadow-sm">
                  <TagOutlined class="text-xs" /> {{ cat.name }}
                </span>
              </div>
              <h1 class="text-xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight mb-8">
                {{ article.title }}
              </h1>

              <div
                v-if="otherTranslations.length"
                class="flex flex-wrap items-center justify-center gap-2 mb-6"
              >
                <span class="text-xs text-gray-500 uppercase tracking-wider">{{ t('article.readIn') }}</span>
                <button
                  v-for="tr in otherTranslations"
                  :key="tr.lang"
                  type="button"
                  class="px-3 py-1 rounded-full text-sm font-medium bg-[#4165d1]/10 text-[#4165d1] hover:bg-[#4165d1]/15 transition"
                  @click="switchLanguage(tr)"
                >
                  {{ languageLabel(tr.lang) }}
                </button>
              </div>

              <div
                class="flex flex-col md:flex-row items-center justify-center gap-y-3 md:gap-y-0 md:gap-x-6 text-gray-500 border-t border-b border-gray-100 py-5">
                <span v-if="article.author_name" class="text-xs sm:text-sm uppercase tracking-widest text-gray-600">
                  {{ article.author_name }}
                </span>
                <span v-if="article.author_name" class="hidden md:block w-1 h-1 bg-gray-300 rounded-full" aria-hidden="true" />
                <span class="inline-flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-widest">
                  <CalendarOutlined class="text-sm" /> {{ formatDate(article.publish_at || article.created_at) }}
                </span>
                <span v-if="article.reading_time" class="hidden md:block w-1 h-1 bg-gray-300 rounded-full" aria-hidden="true" />
                <span v-if="article.reading_time" class="inline-flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-widest">
                  <ClockCircleOutlined class="text-sm" /> {{ article.reading_time }} {{ t('article.minRead') }}
                </span>
                <span v-if="article.view_count" class="hidden md:block w-1 h-1 bg-gray-300 rounded-full" aria-hidden="true" />
                <span v-if="article.view_count" class="inline-flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-widest">
                  <EyeOutlined class="text-sm" /> {{ article.view_count.toLocaleString() }}
                </span>
              </div>
            </div>

            <!-- Hero image below header -->
            <div class="w-full h-[320px] sm:h-[520px] lg:h-[600px] mt-10 overflow-hidden rounded-md bg-gray-50">
              <img v-if="article.thumbnail" :src="article.thumbnail" :alt="article.title"
                class="w-full h-full object-contain object-center" />
              <div v-else class="w-full h-full bg-gradient-to-br from-[#4165d1] to-[#3554b8]" />
            </div>
          </header>

          <!-- Main Content Layout (12-col grid like static) -->
          <main class="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16">
            <!-- Left rail: sticky share (desktop only) -->
            <aside class="hidden lg:block lg:col-span-1">
              <div class="sticky top-24 flex flex-col space-y-6 items-center border-r border-gray-100 pr-6">
                <span class="article-vertical-label text-xs uppercase tracking-widest text-gray-400 mb-2">
                  {{ shareLabel }}
                </span>
                <button type="button" @click="handleShare"
                  class="text-gray-500 hover:text-[#4165d1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4165d1]/20 focus:ring-offset-2 rounded-md p-1.5"
                  :title="shareCopied ? t('article.copied') : t('article.shareArticle')">
                  <ShareAltOutlined class="text-xl" />
                </button>
              </div>
            </aside>

            <!-- Article Content -->
            <article class="lg:col-span-8 lg:col-start-2 max-w-[920px]">
              <!-- Lead / Excerpt -->
              <p v-if="article.excerpt"
                class="article-lead text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 pl-4 border-l-4 border-[#e02838]">
                {{ article.excerpt }}
              </p>

              <div class="article-body-wrapper">
                <template v-if="contentBlocks">
                  <div v-for="(block, index) in contentBlocks" :key="index" class="article-body-block mb-8 last:mb-0">
                    <!-- Text block -->
                    <div v-if="block.type === 'text' && block.html" class="article-body prose prose-gray prose-lg"
                      v-html="block.html" />

                    <!-- Image block (legacy: images array OR single url string) -->
                    <template v-else-if="block.type === 'image' && (block.url || (block.images && block.images.length))">
                      <!-- Single URL string -->
                      <div v-if="block.url" class="article-gallery-grid my-6" :style="galleryContainerStyle(1)">
                        <img :src="block.url" :alt="article.title" class="article-gallery-item"
                          :style="galleryItemStyleAt(1, 0)" @click="openLightbox([block.url], 0)" />
                      </div>
                      <!-- Images array -->
                      <div v-else class="article-gallery-grid my-6" :style="galleryContainerStyle(block.images.length)">
                        <img v-for="(img, i) in block.images" :key="img.key || i" :src="img.url"
                          :alt="article.title + ' ' + t('article.imageNumber', { n: i + 1 })" class="article-gallery-item"
                          :style="galleryItemStyleAt(block.images.length, i)"
                          @click="openLightbox(block.images.map(m => m.url), i)" />
                      </div>
                    </template>

                    <!-- Gallery block (new: urls array) -->
                    <div v-else-if="block.type === 'gallery' && block.urls && block.urls.length"
                      class="article-gallery-grid my-6" :style="galleryContainerStyle(block.urls.length)">
                      <img v-for="(url, i) in block.urls" :key="i" :src="url" :alt="article.title + ' ' + t('article.photoNumber', { n: i + 1 })"
                        class="article-gallery-item" :style="galleryItemStyleAt(block.urls.length, i)"
                        @click="openLightbox(block.urls, i)" />
                    </div>

                    <!-- Mixed / Columns block -->
                    <div v-else-if="block.type === 'mixed'"
                      class="article-mixed-block rounded-md overflow-hidden border border-gray-100 my-6"
                      :style="'display:grid; grid-template-columns:' + (block.layout === '3/4' ? '3fr 1fr' : block.layout === '1/4' ? '1fr 3fr' : '1fr 1fr')">
                      <!-- Image column -->
                      <div v-if="block.image"
                        class="article-mixed-img relative overflow-hidden bg-gray-100 min-h-[200px] cursor-zoom-in group/miximg"
                        @click="openLightbox([block.image.url], 0)">
                        <img :src="block.image.url" :alt="article.title"
                          class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover/miximg:scale-105" />
                        <div
                          class="absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover/miximg:opacity-100 transition-opacity pointer-events-none">
                          <span class="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">{{ t('article.view') }}</span>
                        </div>
                      </div>
                      <div v-else class="article-mixed-img bg-gradient-to-br from-gray-100 to-gray-200 min-h-[200px]"></div>
                      <!-- Text column -->
                      <div class="article-body prose prose-gray prose-lg px-8 p-2" v-html="block.html || ''"></div>
                    </div>
                  </div>
                </template>
                <div v-else class="article-body prose prose-gray prose-lg" v-html="article.content" />
              </div>

              <!-- Tags -->
              <div v-if="article.tags" class="mt-12 pt-10 border-t border-gray-100">
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 block">
                  {{ t('article.tags') }}
                </span>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in article.tags.split(',')" :key="tag.trim()"
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#4165d1]/8 text-[#4165d1] hover:bg-[#4165d1]/12 transition-colors">
                    #{{ tag.trim() }}
                  </span>
                </div>
              </div>

              <ArticleCommentsSection v-if="article?.id" :article-id="article.id" />

              <!-- Back + mobile share -->
              <footer class="mt-12 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button type="button" @click="router.back()"
                  class="inline-flex items-center gap-2 text-gray-500 hover:text-[#4165d1] text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#4165d1]/20 focus:ring-offset-2 rounded-md px-3 py-1.5 hover:bg-[#4165d1]/5">
                  <ArrowLeftOutlined class="text-xs" /> {{ t('article.backToList') }}
                </button>
                <div class="flex items-center gap-3 lg:hidden">
                  <span class="text-sm text-gray-500 font-medium">{{ shareLabel }}</span>
                  <button type="button" @click="handleShare"
                    class="h-9 w-9 rounded-md bg-gray-100 text-gray-600 hover:bg-[#4165d1] hover:text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#4165d1]/30 focus:ring-offset-2"
                    :title="shareCopied ? t('article.copied') : t('article.shareArticle')">
                    <ShareAltOutlined class="text-base" />
                  </button>
                </div>
              </footer>
            </article>

            <!-- Right rail: Recommended -->
            <aside class="hidden lg:block lg:col-span-3 lg:col-start-10">
              <div class="space-y-10">
                <div>
                  <h3 class="text-xs font-bold text-[#4165d1] uppercase tracking-widest border-b border-[#4165d1] pb-2 mb-5">
                    {{ t('article.recommended') }}
                  </h3>

                  <div v-if="isLoadingRecommended" class="space-y-5 animate-pulse">
                    <div v-for="i in 3" :key="i" class="space-y-2">
                      <div class="h-3 bg-gray-200 rounded w-1/2" />
                      <div class="h-5 bg-gray-200 rounded w-full" />
                    </div>
                  </div>

                  <div v-else-if="recommended.length" class="space-y-6">
                    <RouterLink v-for="rec in recommended" :key="rec.id" class="group block"
                      :to="localizedArticleRoute(rec, article?.lang || siteLang)">
                      <span class="text-[11px] text-gray-400 uppercase block mb-1 tracking-widest">
                        <span v-if="rec.category?.name">{{ rec.category.name }}</span>
                        <span v-else-if="rec.categories?.length">{{ rec.categories[0]?.name }}</span>
                        <span v-else>{{ t('article.featured') }}</span>
                        <span v-if="rec.reading_time"> • {{ rec.reading_time }} {{ t('article.minRead') }}</span>
                      </span>
                      <h4 class="text-lg font-semibold text-gray-900 group-hover:text-[#4165d1] transition-colors leading-snug">
                        {{ rec.title }}
                      </h4>
                    </RouterLink>
                  </div>

                  <p v-else class="text-sm text-gray-400">{{ t('article.noRecommendations') }}</p>
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>

    <!-- ─── Lightbox ──────────────────────────────────────────────────── -->
    <teleport to="body">
      <transition name="lb">
        <div v-if="lightboxOpen" class="lightbox-overlay" @click.self="closeLightbox" role="dialog" aria-modal="true">
          <!-- Close -->
          <button class="lightbox-close" @click="closeLightbox" :aria-label="t('article.close')">&#10005;</button>

          <!-- Prev -->
          <button v-if="lightboxUrls.length > 1" class="lightbox-nav lightbox-prev" @click="lightboxPrev"
            :aria-label="t('article.previous')">&#8249;</button>

          <!-- Image -->
          <div class="lightbox-img-wrap">
            <img :src="lightboxUrls[lightboxIndex]" :alt="t('article.imageOf', { n: lightboxIndex + 1, total: lightboxUrls.length })"
              class="lightbox-img" />
          </div>

          <!-- Next -->
          <button v-if="lightboxUrls.length > 1" class="lightbox-nav lightbox-next" @click="lightboxNext"
            :aria-label="t('article.next')">&#8250;</button>

          <!-- Counter -->
          <div v-if="lightboxUrls.length > 1" class="lightbox-counter">
            {{ lightboxIndex + 1 }} / {{ lightboxUrls.length }}
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.article-lead {
  font-family: inherit;
}

.article-vertical-label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3) {
  font-weight: 700;
  color: #111827;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.article-body :deep(h1) {
  font-size: 1.5rem;
  line-height: 2rem;
}

.article-body :deep(h2) {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.article-body :deep(h3) {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.article-body :deep(p) {
  color: #374151;
  line-height: 1.625;
  margin-bottom: 1rem;
}

.article-body :deep(a) {
  color: #4165d1;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.article-body :deep(a:hover) {
  color: #e02838;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.article-body :deep(ul) {
  list-style-type: disc;
}

.article-body :deep(ol) {
  list-style-type: decimal;
}

.article-body :deep(li) {
  margin-bottom: 0.25rem;
  color: #374151;
}

.article-body :deep(blockquote) {
  border-left: 4px solid #e02838;
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-style: italic;
  color: #4b5563;
}

.article-body :deep(img) {
  border-radius: 0.2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  max-width: 100%;
  height: auto;
}

/* Mixed column block */
.article-mixed-block {
  container-type: inline-size;
}

/* Gallery grid */
.article-gallery-grid {
  gap: 0.375rem;
  overflow: hidden;
  border-radius: 0.2rem;
}

.article-gallery-item {
  display: block;
  cursor: zoom-in;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.article-gallery-item:hover {
  opacity: 0.88;
  transform: scale(1.012);
}

/* ─── Mobile: single column ─────────────────────────────────────── */
@media (max-width: 640px) {

  /* Gallery: stack all layouts to 1 column */
  .article-gallery-grid {
    display: flex !important;
    flex-direction: column !important;
    height: auto !important;
  }

  .article-gallery-item {
    width: 100% !important;
    height: auto !important;
    flex: none !important;
    grid-column: unset !important;
    aspect-ratio: 4/3 !important;
    object-fit: cover !important;
  }

  /* Mixed block: stack image above text */
  .article-mixed-block {
    grid-template-columns: 1fr !important;
  }

  .article-mixed-img {
    min-height: 220px;
  }

  .article-vertical-label {
    writing-mode: horizontal-tb;
  }
}

/* ─── Lightbox ───────────────────────────────────────────────────── */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.lightbox-img-wrap {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.6);
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: none;
  border-radius: 20%;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.25);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.12);
  border: none;
  border-radius: 50%;
  color: #fff;
  width: 3rem;
  height: 3rem;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.28);
}

.lightbox-prev {
  left: 1rem;
}

.lightbox-next {
  right: 1rem;
}

.lightbox-counter {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  background: rgba(0, 0, 0, 0.4);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

/* Transition */
.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.2s ease;
}

.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}
</style>
