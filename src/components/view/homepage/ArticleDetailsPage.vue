<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
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
import ArticleCommentsSection from './ArticleCommentsSection.vue';

const route = useRoute();
const router = useRouter();
const article = ref(null);
const isLoading = ref(true);
const hasError = ref(false);
const shareCopied = ref(false);
const readProgress = ref(0);
const recommended = ref([]);
const isLoadingRecommended = ref(false);

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

const shareLabel = computed(() => (shareCopied.value ? 'Link copied!' : 'Share'));

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

async function loadArticle() {
  isLoading.value = true;
  hasError.value = false;
  article.value = null;
  try {
    const data = await NewsService.getArticleById(route.params.id);
    article.value = data;
  } catch (error) {
    console.error('Failed to load article:', error);
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
}

async function loadRecommended() {
  isLoadingRecommended.value = true;
  try {
    const items = await NewsService.getFeaturedArticles();
    const currentId = String(route.params.id);
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
  loadArticle();
  loadRecommended();
  window.addEventListener('scroll', updateReadProgress, { passive: true });
  window.addEventListener('keydown', onLightboxKey);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadProgress);
  window.removeEventListener('keydown', onLightboxKey);
  document.body.style.overflow = '';
});
</script>

<template>
  <div class="w-full article-details min-h-screen bg-[#f8f9fa] flex items-center justify-center">
    <!-- Reading progress bar -->
    <div v-if="article" class="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-10 " aria-hidden="true">
      <div class="h-full bg-gradient-to-r from-[#1a365d] to-[#d4a853] transition-[width] duration-150"
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
      <div v-else-if="hasError" class="py-12 sm:py-16">
        <div class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 sm:p-10 md:p-12 text-center max-w-3xl mx-auto">
          <ExclamationCircleOutlined class="text-5xl text-gray-300 mb-4 block mx-auto" aria-hidden="true" />
          <p class="text-gray-700 text-lg font-medium mb-2">Failed to load article.</p>
          <p class="text-gray-500 text-sm mb-6">The article may not exist or the connection failed.</p>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <button type="button" @click="loadArticle"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:ring-offset-2">
              <ReloadOutlined /> Retry
            </button>
            <button type="button" @click="router.back()"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a365d] text-white text-sm font-medium rounded-md hover:bg-[#2a4a7f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a365d]/30 focus:ring-offset-2 shadow-sm">
              <ArrowLeftOutlined /> Go Back
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
                  class="inline-flex items-center gap-1.5 bg-white text-[#1a365d] px-3 py-1 text-xs sm:text-sm uppercase tracking-widest rounded-full ring-1 ring-gray-200 shadow-sm">
                  <TagOutlined class="text-xs" /> {{ cat.name }}
                </span>
              </div>
              <h1 class="text-xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight mb-8">
                {{ article.title }}
              </h1>

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
                  <ClockCircleOutlined class="text-sm" /> {{ article.reading_time }} min read
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
              <div v-else class="w-full h-full bg-gradient-to-br from-[#1a365d] to-[#2a4a7f]" />
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
                  class="text-gray-500 hover:text-[#1a365d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:ring-offset-2 rounded-md p-1.5"
                  :title="shareCopied ? 'Copied' : 'Share article'">
                  <ShareAltOutlined class="text-xl" />
                </button>
              </div>
            </aside>

            <!-- Article Content -->
            <article class="lg:col-span-8 lg:col-start-2 max-w-[920px]">
              <!-- Lead / Excerpt -->
              <p v-if="article.excerpt"
                class="article-lead text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 pl-4 border-l-4 border-[#d4a853]">
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
                          :alt="article.title + ' image ' + (i + 1)" class="article-gallery-item"
                          :style="galleryItemStyleAt(block.images.length, i)"
                          @click="openLightbox(block.images.map(m => m.url), i)" />
                      </div>
                    </template>

                    <!-- Gallery block (new: urls array) -->
                    <div v-else-if="block.type === 'gallery' && block.urls && block.urls.length"
                      class="article-gallery-grid my-6" :style="galleryContainerStyle(block.urls.length)">
                      <img v-for="(url, i) in block.urls" :key="i" :src="url" :alt="article.title + ' photo ' + (i + 1)"
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
                          <span class="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">🔍 View</span>
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
                  Tags
                </span>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in article.tags.split(',')" :key="tag.trim()"
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#1a365d]/8 text-[#1a365d] hover:bg-[#1a365d]/12 transition-colors">
                    #{{ tag.trim() }}
                  </span>
                </div>
              </div>

              <ArticleCommentsSection v-if="article?.id" :article-id="article.id" />

              <!-- Back + mobile share -->
              <footer class="mt-12 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button type="button" @click="router.back()"
                  class="inline-flex items-center gap-2 text-gray-500 hover:text-[#1a365d] text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a365d]/20 focus:ring-offset-2 rounded-md px-3 py-1.5 hover:bg-[#1a365d]/5">
                  <ArrowLeftOutlined class="text-xs" /> Back to list
                </button>
                <div class="flex items-center gap-3 lg:hidden">
                  <span class="text-sm text-gray-500 font-medium">{{ shareLabel }}</span>
                  <button type="button" @click="handleShare"
                    class="h-9 w-9 rounded-md bg-gray-100 text-gray-600 hover:bg-[#1a365d] hover:text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#1a365d]/30 focus:ring-offset-2"
                    :title="shareCopied ? 'Copied' : 'Share article'">
                    <ShareAltOutlined class="text-base" />
                  </button>
                </div>
              </footer>
            </article>

            <!-- Right rail: Recommended -->
            <aside class="hidden lg:block lg:col-span-3 lg:col-start-10">
              <div class="space-y-10">
                <div>
                  <h3 class="text-xs font-bold text-[#1a365d] uppercase tracking-widest border-b border-[#1a365d] pb-2 mb-5">
                    Recommended
                  </h3>

                  <div v-if="isLoadingRecommended" class="space-y-5 animate-pulse">
                    <div v-for="i in 3" :key="i" class="space-y-2">
                      <div class="h-3 bg-gray-200 rounded w-1/2" />
                      <div class="h-5 bg-gray-200 rounded w-full" />
                    </div>
                  </div>

                  <div v-else-if="recommended.length" class="space-y-6">
                    <RouterLink v-for="rec in recommended" :key="rec.id" class="group block"
                      :to="{ name: 'articleDetails', params: { id: rec.id } }">
                      <span class="text-[11px] text-gray-400 uppercase block mb-1 tracking-widest">
                        <span v-if="rec.category?.name">{{ rec.category.name }}</span>
                        <span v-else-if="rec.categories?.length">{{ rec.categories[0]?.name }}</span>
                        <span v-else>Featured</span>
                        <span v-if="rec.reading_time"> • {{ rec.reading_time }} min read</span>
                      </span>
                      <h4 class="text-lg font-semibold text-gray-900 group-hover:text-[#1a365d] transition-colors leading-snug">
                        {{ rec.title }}
                      </h4>
                    </RouterLink>
                  </div>

                  <p v-else class="text-sm text-gray-400">No recommendations available.</p>
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
          <button class="lightbox-close" @click="closeLightbox" aria-label="Close">&#10005;</button>

          <!-- Prev -->
          <button v-if="lightboxUrls.length > 1" class="lightbox-nav lightbox-prev" @click="lightboxPrev"
            aria-label="Previous">&#8249;</button>

          <!-- Image -->
          <div class="lightbox-img-wrap">
            <img :src="lightboxUrls[lightboxIndex]" :alt="'Image ' + (lightboxIndex + 1) + ' of ' + lightboxUrls.length"
              class="lightbox-img" />
          </div>

          <!-- Next -->
          <button v-if="lightboxUrls.length > 1" class="lightbox-nav lightbox-next" @click="lightboxNext"
            aria-label="Next">&#8250;</button>

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
  color: #1a365d;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.article-body :deep(a:hover) {
  color: #d4a853;
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
  border-left: 4px solid #d4a853;
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
