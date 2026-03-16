<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftOutlined, ShareAltOutlined, CalendarOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { MessengerService } from '@/services/MessengerService';
import MessengerFlipbookViewer from './MessengerFlipbookViewer.vue';

const route = useRoute();
const router = useRouter();

const issue = ref(null);
const isLoading = ref(true);
const hasError = ref(false);
const shareCopied = ref(false);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const issueSlug = computed(() => route.params.slug);

async function loadIssue() {
  isLoading.value = true;
  hasError.value = false;
  issue.value = null;
  try {
    const data = await MessengerService.getIssueBySlug(issueSlug.value);
    issue.value = data;
  } catch (error) {
    console.error('Failed to load messenger issue:', error);
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
}

async function handleShare() {
  const url = window.location.href;
  const title = issue.value?.title ?? document.title;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    shareCopied.value = true;
    setTimeout(() => {
      shareCopied.value = false;
    }, 2000);
  } catch {
    // ignore
  }
}

onMounted(() => {
  loadIssue();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50/80">
    <div class="w-full max-w-5xl mx-auto p-4">
      <!-- Loading -->
      <div
        v-if="isLoading"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
      >
        <div class="aspect-video w-full bg-gray-200" />
        <div class="p-6 sm:p-10 space-y-5">
          <div class="h-7 bg-gray-200 rounded w-2/3 max-w-md" />
          <div class="h-4 bg-gray-200 rounded w-full max-w-xl" />
          <div class="h-4 bg-gray-200 rounded w-full" />
          <div class="h-4 bg-gray-200 rounded w-4/5" />
        </div>
      </div>

      <!-- Error -->
      <div
        v-else-if="hasError"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 sm:p-12 text-center"
      >
        <ExclamationCircleOutlined class="text-5xl text-gray-300 mb-4 block mx-auto" aria-hidden="true" />
        <p class="text-gray-700 text-lg font-medium mb-2">Failed to load issue.</p>
        <p class="text-gray-500 text-sm mb-6">The issue may not exist or the connection failed.</p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            @click="loadIssue"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ReloadOutlined /> Retry
          </button>
          <button
            type="button"
            @click="router.back()"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowLeftOutlined /> Go Back
          </button>
        </div>
      </div>

      <!-- Content -->
      <article
        v-else-if="issue"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <!-- Header -->
        <header class="relative aspect-video w-full overflow-hidden">
          <img
            v-if="issue.thumbnail_url"
            :src="issue.thumbnail_url"
            :alt="issue.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
            aria-hidden="true"
          />
          <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80 mb-4">
              <span class="inline-flex items-center gap-1.5">
                <CalendarOutlined /> {{ formatDate(issue.issue_date) }}
              </span>
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm font-medium"
              >
                {{ issue.is_published ? 'Published' : 'Draft' }}
              </span>
            </div>
            <h1
              class="text-2xl sm:text-4xl font-bold leading-tight tracking-tight drop-shadow-md [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]"
            >
              {{ issue.title }}
            </h1>
          </div>
        </header>

        <div class="px-6 sm:px-10 py-8 sm:py-10 space-y-8">
          <p
            v-if="issue.description"
            class="text-gray-600 leading-relaxed mb-4"
          >
            {{ issue.description }}
          </p>

          <div v-if="issue.pdf_url" class="mt-4">
            <MessengerFlipbookViewer :pdf-url="issue.pdf_url" height="600px" />
          </div>
          <div v-else class="text-sm text-gray-500">
            No PDF is attached to this issue.
          </div>

          <footer
            class="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <button
              type="button"
              @click="router.back()"
              class="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              <ArrowLeftOutlined class="text-xs" /> Back to list
            </button>
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-500 font-medium">
                {{ shareCopied ? 'Link copied!' : 'Share' }}
              </span>
              <button
                type="button"
                @click="handleShare"
                class="h-9 w-9 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :title="shareCopied ? 'Copied' : 'Share issue'"
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

