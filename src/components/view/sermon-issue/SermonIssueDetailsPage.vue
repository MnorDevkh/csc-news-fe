<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SermonIssueService } from '@/services/SermonIssueService';
import MessengerFlipbookViewer from '@/components/view/messenger/MessengerFlipbookViewer.vue';

const route = useRoute();
const router = useRouter();

const issue = ref(null);
const loading = ref(true);
const error = ref('');

const slug = computed(() => route.params.slug);

async function loadIssue() {
  loading.value = true;
  error.value = '';
  issue.value = null;
  try {
    const data = await SermonIssueService.getIssueBySlug(slug.value);
    issue.value = data;
  } catch (e) {
    console.error('Failed to load sermon issue:', e);
    error.value = 'Failed to load issue. Please try again later.';
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: 'sermonIssueList' });
}

onMounted(() => {
  loadIssue();
});

watch(slug, () => {
  loadIssue();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-3 sm:py-6">
    <div class="max-w-6xl mx-auto px-3 sm:px-5">
      <button
        type="button"
        class="mb-3 text-sm font-medium text-gray-600 hover:text-gray-900"
        @click="goBack"
      >
        ← Back to issues
      </button>

      <div v-if="loading" class="overflow-hidden rounded-xl border border-gray-100 bg-white p-6">
        <div class="mx-auto h-[min(72vh,820px)] min-h-[320px] animate-pulse rounded-lg bg-gray-200" />
      </div>

      <div v-else-if="error" class="rounded-xl border border-red-100 bg-white p-8 text-center">
        <p class="mb-3 text-sm text-red-600">{{ error }}</p>
        <button
          type="button"
          class="text-sm font-medium text-primary hover:text-primary-hover"
          @click="loadIssue"
        >
          Retry
        </button>
      </div>

      <MessengerFlipbookViewer
        v-else-if="issue?.pdf_url"
        :pdfUrl="issue.pdf_url"
        :title="issue?.title || 'The Sermon'"
      />

      <div
        v-else
        class="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600"
      >
        PDF not available for this issue.
      </div>
    </div>
  </div>
</template>
