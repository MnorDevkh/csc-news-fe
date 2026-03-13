<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ShareAltOutlined,
  CalendarOutlined,
  TagOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue';
import { NewsService } from '@/services/NewsService.js';

const route = useRoute();
const router = useRouter();
const article = ref(null);
const isLoading = ref(true);
const hasError = ref(false);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

onMounted(async () => {
  try {
    const data = await NewsService.getArticleById(route.params.id);
    article.value = data;
  } catch (error) {
    console.error('Failed to load article:', error);
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="article-details min-h-screen bg-gray-50/80">
    <div class="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

      <!-- Back Button -->
      <button
        type="button"
        @click="router.back()"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6 py-2 px-3 -ml-3 rounded-lg hover:bg-white hover:shadow-sm group"
      >
        <ArrowLeftOutlined class="text-base group-hover:-translate-x-0.5 transition-transform" />
        <span class="text-sm font-medium">Back to News</span>
      </button>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
      >
        <div class="h-64 sm:h-80 w-full bg-gray-200" />
        <div class="p-6 sm:p-10 space-y-4">
          <div class="h-7 bg-gray-200 rounded w-2/3 max-w-md" />
          <div class="h-4 bg-gray-200 rounded w-full max-w-xl" />
          <div class="h-4 bg-gray-200 rounded w-full" />
          <div class="h-4 bg-gray-200 rounded w-4/5" />
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="hasError"
        class="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 sm:p-12 text-center"
      >
        <p class="text-gray-700 text-lg font-medium mb-2">Failed to load article.</p>
        <p class="text-gray-500 text-sm mb-6">The article may not exist or the connection failed.</p>
        <button
          type="button"
          @click="router.back()"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeftOutlined /> Go Back
        </button>
      </div>

      <!-- Article Content -->
      <article
        v-else-if="article"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <!-- Hero Image -->
        <header class="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            v-if="article.thumbnail"
            :src="article.thumbnail"
            :alt="article.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            aria-hidden="true"
          />
          <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/90 mb-4">
              <span
                v-if="article.category?.name"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm font-medium"
              >
                <TagOutlined /> {{ article.category.name }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <CalendarOutlined /> {{ formatDate(article.publish_at || article.created_at) }}
              </span>
              <span v-if="article.reading_time" class="inline-flex items-center gap-1.5">
                <ClockCircleOutlined /> {{ article.reading_time }} min read
              </span>
              <span v-if="article.view_count" class="inline-flex items-center gap-1.5">
                <EyeOutlined /> {{ article.view_count.toLocaleString() }} views
              </span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-bold leading-tight tracking-tight drop-shadow-sm">
              {{ article.title }}
            </h1>
          </div>
        </header>

        <!-- Body -->
        <div class="px-6 sm:px-10 py-8 sm:py-10">
          <!-- Lead / Excerpt -->
          <p
            v-if="article.excerpt"
            class="article-lead text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 pl-4 border-l-4 border-blue-500"
          >
            {{ article.excerpt }}
          </p>

          <!-- Main content (HTML) -->
          <div
            class="article-body prose prose-gray prose-lg max-w-none"
            v-html="article.content"
          />

          <!-- Tags -->
          <div v-if="article.tags" class="mt-10 pt-8 border-t border-gray-100">
            <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 block">
              Tags
            </span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in article.tags.split(',')"
                :key="tag.trim()"
                class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                #{{ tag.trim() }}
              </span>
            </div>
          </div>

          <!-- Share & Back -->
          <footer class="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              type="button"
              @click="router.back()"
              class="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              <ArrowLeftOutlined class="text-xs" /> Back to list
            </button>
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-500 font-medium">Share</span>
              <button
                type="button"
                class="h-9 w-9 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                title="Share article"
              >
                <ShareAltOutlined class="text-base" />
              </button>
            </div>
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
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.article-body :deep(a:hover) {
  color: #1d4ed8;
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
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-style: italic;
  color: #4b5563;
}
.article-body :deep(img) {
  border-radius: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  max-width: 100%;
  height: auto;
}
</style>
