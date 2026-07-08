<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import StructureContentBlocks from '@/components/content/StructureContentBlocks.vue';
import { StructurePageService } from '@/services/StructurePageService';

const route = useRoute();
const router = useRouter();
const content = ref(null);
const isLoading = ref(true);
const hasError = ref(false);

function parseContentBlocks(raw) {
  if (!raw || !String(raw).trim()) return null;
  const s = String(raw).trim();
  if (!s.startsWith('[') || !s.endsWith(']')) return null;
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const hasValidType = arr.every(
      (b) => b && typeof b === 'object' && (b.type === 'text' || b.type === 'image' || b.type === 'text_image')
    );
    return hasValidType ? arr : null;
  } catch {
    return null;
  }
}

const contentBlocks = computed(() => {
  if (!content.value || content.value.content == null) return null;
  return parseContentBlocks(content.value.content);
});

const pageTitle = computed(() => content.value?.title || '');

async function loadContent() {
  const slug = route.params.slug;
  if (!slug || typeof slug !== 'string') {
    hasError.value = true;
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  hasError.value = false;
  content.value = null;
  try {
    const data = await StructurePageService.getBySlug(slug);
    content.value = data;
  } catch (error) {
    console.error('Failed to load structure page:', error);
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
}

watch(
  () => route.params.slug,
  () => {
    loadContent();
  }
);

onMounted(() => {
  loadContent();
});
</script>

<template>
  <div
    class="structure-page min-h-screen bg-gray-50/80 flex items-center justify-center font-[Kantumruy_Pro,'Khmer','Koh_Santepheap',sans-serif]"
  >
    <div class="w-full max-w-7xl mx-auto px-3 py-3 sm:px-4 sm:py-4">
      <div v-if="isLoading" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
        <div class="aspect-video w-full bg-gray-200" />
        <div class="p-6 sm:p-10 space-y-5">
          <div class="h-7 bg-gray-200 rounded w-2/3 max-w-md" />
          <div class="h-4 bg-gray-200 rounded w-full max-w-xl" />
          <div class="h-4 bg-gray-200 rounded w-full" />
        </div>
      </div>

      <div
        v-else-if="hasError"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 md:p-12 text-center"
      >
        <ExclamationCircleOutlined class="text-5xl text-gray-300 mb-4 block mx-auto" aria-hidden="true" />
        <p class="text-gray-700 text-lg font-medium mb-2">មិនអាចផ្ទុកទំព័របានទេ</p>
        <p class="text-gray-500 text-sm mb-6">ទំព័រនេះមិនមាន ឬមានបញ្ហាតភ្ជាប់</p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
            @click="loadContent"
          >
            <ReloadOutlined /> ព្យាយាមម្តងទៀត
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            @click="router.push({ name: 'structureIndex' })"
          >
            <ArrowLeftOutlined /> រចនាសម្ព័ន្ធ
          </button>
        </div>
      </div>

      <article v-else-if="content" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <header class="relative aspect-video w-full overflow-hidden">
          <img
            v-if="content.thumbnail"
            :src="content.thumbnail"
            :alt="pageTitle"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" aria-hidden="true" />
          <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
            <nav class="text-xs sm:text-sm text-white/80 mb-2">
              <router-link :to="{ name: 'home' }" class="hover:underline">ទំព័រដើម</router-link>
              <span class="mx-2">/</span>
              <router-link :to="{ name: 'structureIndex' }" class="hover:underline">រចនាសម្ព័ន្ធ</router-link>
            </nav>
            <h1
              class="text-2xl sm:text-4xl font-bold leading-tight tracking-tight drop-shadow-md [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] m-0"
            >
              {{ pageTitle || route.params.slug }}
            </h1>
          </div>
        </header>

        <div class="px-4 sm:px-10 py-6 sm:py-10">
          <p
            v-if="content.excerpt"
            class="article-lead text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 pl-4 border-l-4 border-blue-500"
          >
            {{ content.excerpt }}
          </p>

          <div class="article-body-wrapper">
            <StructureContentBlocks
              v-if="contentBlocks"
              :blocks="contentBlocks"
              :page-title="pageTitle"
            />
            <div
              v-else-if="content.content"
              class="article-body ck-content prose prose-gray prose-lg max-w-none"
              v-html="content.content"
            />
            <p v-else class="text-gray-500 text-center py-8">មិនទាន់មានខ្លឹមសារ</p>
          </div>

          <footer class="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
              @click="router.push({ name: 'structureIndex' })"
            >
              <ArrowLeftOutlined class="text-xs" /> រចនាសម្ព័ន្ធ
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
              @click="router.push({ name: 'home' })"
            >
              ទំព័រដើម
            </button>
          </footer>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.article-lead {
  font-family: inherit;
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4),
.article-body :deep(h5),
.article-body :deep(h6) {
  font-weight: 700;
  color: #111827;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.article-body :deep(p) {
  color: #374151;
  line-height: 1.625;
  margin-bottom: 1rem;
}

.article-body :deep(a) {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.article-body :deep(a:hover) {
  color: #1d4ed8;
}

.article-body :deep([style*='text-align: center']),
.article-body :deep([style*='text-align:center']) {
  text-align: center;
}

.article-body :deep([style*='text-align: right']),
.article-body :deep([style*='text-align:right']) {
  text-align: right;
}

.article-body :deep([style*='text-align: justify']),
.article-body :deep([style*='text-align:justify']) {
  text-align: justify;
}
</style>
