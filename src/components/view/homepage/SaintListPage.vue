<template>
  <div class="min-h-screen bg-gray-50 py-4 sm:py-8">
    <div class="max-w-6xl mx-auto px-3 sm:px-5">
      <div class="flex items-end justify-between gap-3 mb-5">
        <div class="min-w-0">
          <h1 class="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">{{ t('saints.allSaints') }}</h1>
          <p class="text-sm text-gray-600 mt-1">{{ t('saints.listSubtitle') }}</p>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-16">
        <a-spin size="large" />
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          type="button"
          class="text-primary hover:text-burgundy font-medium"
          @click="loadSaints"
        >
          {{ t('common.retry') }}
        </button>
      </div>

      <div v-else-if="!items.length" class="text-center py-12 text-gray-600">
        {{ t('saints.notFoundList') }}
      </div>

      <div v-else class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100">
        <ul class="divide-y divide-gray-100">
          <li v-for="saint in items" :key="saint.id" class="group">
            <RouterLink
              :to="{ name: 'saintDetail', params: { slug: saint.slug } }"
              class="flex items-start gap-4 py-4 px-4 sm:px-6 hover:bg-gray-50 transition-colors"
            >
              <div class="flex-shrink-0">
                <img
                  v-if="saint.image_url"
                  :src="saint.image_url"
                  :alt="saint.name"
                  class="h-20 w-20 sm:h-24 sm:w-24 rounded-md object-cover shadow-sm bg-gray-100"
                  loading="lazy"
                >
                <div
                  v-else
                  class="h-20 w-20 sm:h-24 sm:w-36 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-xs"
                >
                  {{ t('common.noImage') }}
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3">
                  <h3 class="font-semibold text-gray-900 group-hover:text-burgundy transition-colors">
                    {{ saint.name }}
                  </h3>
                  <span class="text-xs text-gray-500 shrink-0">
                    {{ saint.feast_day || '' }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                  {{ saint.bio_snippet || '' }}
                </p>
              </div>
            </RouterLink>
          </li>
        </ul>
      </div>

      <div v-if="showPagination" class="flex items-center justify-center gap-3 mt-6">
        <button
          type="button"
          class="px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          :disabled="pageIndex <= 1 || loading"
          @click="goToPage(pageIndex - 1)"
        >
          {{ t('saints.previous') }}
        </button>
        <span class="text-sm text-gray-600">
          {{ t('common.pageOf', { n: pageIndex, total: totalPages }) }}
        </span>
        <button
          type="button"
          class="px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          :disabled="pageIndex >= totalPages || loading"
          @click="goToPage(pageIndex + 1)"
        >
          {{ t('saints.next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SaintService } from '@/services/SaintService';

const { t } = useI18n();

const loading = ref(true);
const error = ref('');

const items = ref([]);
const pageIndex = ref(1);
const pageSize = ref(12);
const totalPages = ref(0);
const totalElements = ref(0);

const showPagination = computed(() => totalPages.value > 1);

function toSkip(page) {
  return (page - 1) * pageSize.value;
}

async function loadSaints() {
  loading.value = true;
  error.value = '';
  try {
    const data = await SaintService.getPublicSaints({
      skip: toSkip(pageIndex.value),
      limit: pageSize.value,
    });
    items.value = data?.items || [];
    totalPages.value = data?.total_pages || 0;
    totalElements.value = data?.total_elements || 0;
  } catch (e) {
    console.error('Failed to load saints list:', e);
    error.value = t('saints.loadFailedLater');
    items.value = [];
    totalPages.value = 0;
    totalElements.value = 0;
  } finally {
    loading.value = false;
  }
}

async function goToPage(page) {
  if (page < 1) return;
  if (totalPages.value && page > totalPages.value) return;
  pageIndex.value = page;
  await loadSaints();
  window?.scrollTo?.({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  loadSaints();
});
</script>
