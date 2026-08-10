<template>
  <div class="min-h-screen bg-gray-50 pt-4 pb-8 sm:pb-12 font-sans">
    <div class="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 min-w-0 w-full">
      <!-- <button
        @click="$router.back()"
        class="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-8 group"
      >
        <ArrowLeftOutlined class="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Daily Readings
      </button> -->

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-10 md:p-12 min-w-0">
        <div v-if="loading" class="py-12 text-center text-gray-500">
          {{ t('dailyBible.loadingReading') }}
        </div>

        <div v-else-if="error" class="py-12 text-center">
          <p class="text-red-500 mb-4">
            {{ error }}
          </p>
          <button @click="goBackToList"
            class="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            {{ t('dailyBible.backToList') }}
          </button>
        </div>

        <div v-else class="space-y-10 min-w-0">
          <div class="text-center">
            <span class="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
              {{ t('dailyBible.dailyReading') }}
            </span>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              {{ reading.reference || reading.title }}
            </h1>
            <div class="text-gray-500 font-medium text-lg">
              {{ formatDate(reading.reading_date) }}
            </div>
          </div>

          <div
            class="prose prose-lg prose-blue max-w-none mx-auto text-gray-800 leading-relaxed font-serif w-full min-w-0 overflow-x-auto overscroll-x-contain"
          >
            <div class="daily-reading-html min-w-0" v-html="reading.content" />
          </div>

          <div class="mt-12 pt-8 border-t border-gray-100 flex justify-center gap-6">
            <button class="flex flex-col items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
              <div
                class="h-12 w-12 rounded-md bg-gray-50 flex items-center justify-center text-xl group-hover:bg-blue-50">
                <ShareAltOutlined />
              </div>
              <span class="text-xs font-medium">{{ t('dailyBible.share') }}</span>
            </button>
            <button class="flex flex-col items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
              <div
                class="h-12 w-12 rounded-md bg-gray-50 flex items-center justify-center text-xl group-hover:bg-blue-50">
                <BookOutlined />
              </div>
              <span class="text-xs font-medium">{{ t('dailyBible.bookmark') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ArrowLeftOutlined, ShareAltOutlined, BookOutlined } from '@ant-design/icons-vue';
import { DailyReadingService } from '@/services/DailyReadingService';

const { t } = useI18n();

const props = defineProps({
  setPageMeta: {
    type: Function,
    default: null,
  },
});

const route = useRoute();
const router = useRouter();

const reading = ref({
  id: null,
  title: '',
  reference: '',
  reading_date: '',
  snippet: '',
  content: '',
});
const loading = ref(false);
const error = ref('');

function formatDate(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

async function loadReading() {
  loading.value = true;
  error.value = '';
  try {
    const data = await DailyReadingService.getReadingById(route.params.id, {
      public_only: true,
    });
    reading.value = data;
  } catch (err) {
    console.error('Failed to load daily reading', err);
    error.value = t('dailyBible.notFound');
  } finally {
    loading.value = false;
  }
}

function goBackToList() {
  router.push({ name: 'dailyBibleList' });
}

onMounted(() => {
  loadReading();
  if (props.setPageMeta) {
    props.setPageMeta({
      title: t('dailyBible.title'),
    });
  }
});
</script>

<style scoped>
/* Tables: constrain layout on narrow viewports; horizontal scroll inside figure, not page */
.prose :deep(figure.table) {
  display: block;
  margin: 1.5rem 0;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
}

.prose :deep(figure.table table) {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  border-collapse: collapse;
}

.prose :deep(figure.table th),
.prose :deep(figure.table td) {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  word-break: break-word;
  overflow-wrap: anywhere;
}

/* Plain <table> in HTML (no figure wrapper) — prose overflow-x scrolls wide tables */
.daily-reading-html :deep(table) {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
}

.daily-reading-html :deep(table th),
.daily-reading-html :deep(table td) {
  word-break: break-word;
  overflow-wrap: anywhere;
}

@media (max-width: 639px) {
  .prose :deep(figure.table table),
  .daily-reading-html :deep(table) {
    table-layout: fixed;
  }
}
</style>
