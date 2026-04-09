<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessengerService } from '@/services/MessengerService';
import MessengerFlipbookViewer from '@/components/view/messenger/MessengerFlipbookViewer.vue';

const route = useRoute();
const router = useRouter();

const issue = ref(null);
const loading = ref(true);
const error = ref('');

const slug = computed(() => route.params.slug);

function formatDate(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

const issueDateLabel = computed(() => formatDate(issue.value?.issue_date));

async function loadIssue() {
  loading.value = true;
  error.value = '';
  issue.value = null;
  try {
    const data = await MessengerService.getIssueBySlug(slug.value);
    issue.value = data;
  } catch (e) {
    console.error('Failed to load messenger issue:', e);
    error.value = 'Failed to load issue. Please try again later.';
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: 'messengerList' });
}

onMounted(() => {
  loadIssue();
});

watch(slug, () => {
  loadIssue();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-4 sm:py-8">
    <div class="max-w-6xl mx-auto px-3 sm:px-5">
      <button
        type="button"
        class="text-sm text-gray-600 hover:text-gray-900 font-medium mb-5"
        @click="goBack"
      >
        ← Back to issues
      </button>

      <div v-if="loading" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8">
        <div class="animate-pulse space-y-4">
          <div class="h-7 bg-gray-200 rounded w-2/3" />
          <div class="h-4 bg-gray-200 rounded w-1/3" />
          <div class="h-64 bg-gray-200 rounded" />
        </div>
      </div>

      <div v-else-if="error" class="bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center">
        <p class="text-red-600 text-sm mb-3">{{ error }}</p>
        <button
          type="button"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium"
          @click="loadIssue"
        >
          Retry
        </button>
      </div>

      <div v-else class="space-y-6">
        <header class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-4 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div class="w-full sm:w-56">
              <div class="aspect-[4/3] rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  v-if="issue?.thumbnail_url"
                  :src="issue.thumbnail_url"
                  :alt="issue?.title || 'The Messenger'"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase">
                  The Messenger
                </div>
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                {{ issue?.title }}
              </h1>
              <div class="mt-2 text-sm text-gray-500">
                <span v-if="issueDateLabel">{{ issueDateLabel }}</span>
              </div>
              <p v-if="issue?.description" class="mt-4 text-gray-700 text-sm leading-relaxed">
                {{ issue.description }}
              </p>
            </div>
          </div>
        </header>

        <MessengerFlipbookViewer
          v-if="issue?.pdf_url"
          :pdfUrl="issue.pdf_url"
          :title="issue?.title || 'The Messenger'"
        />

        <div v-else class="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-600">
          PDF not available for this issue.
        </div>
      </div>
    </div>
  </div>
</template>

