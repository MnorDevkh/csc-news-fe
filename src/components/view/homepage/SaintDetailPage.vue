<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SaintService } from '@/services/SaintService';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const saint = ref(null);
const loading = ref(true);
const error = ref('');

const slug = computed(() => route.params.slug);

async function loadSaint() {
  loading.value = true;
  error.value = '';
  saint.value = null;
  try {
    const data = await SaintService.getPublicSaintBySlug(slug.value);
    saint.value = data;
  } catch (e) {
    console.error('Failed to load saint:', e);
    error.value = t('saints.loadDetailFailed');
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: 'saintList' });
}

onMounted(() => {
  loadSaint();
});

watch(slug, () => {
  loadSaint();
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
        ← {{ t('saints.backToSaints') }}
      </button>

      <div v-if="loading" class="flex justify-center py-16">
        <a-spin size="large" />
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          type="button"
          @click="goBack"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          {{ t('saints.backToList') }}
        </button>
      </div>

      <div v-else-if="!saint" class="text-center py-12 text-gray-600">
        {{ t('saints.notFound') }}
      </div>

      <article v-else class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-5">
          <div class="lg:col-span-2 bg-gray-100">
            <img
              v-if="saint.image_url"
              :src="saint.image_url"
              :alt="saint.name"
              class="w-full h-72 lg:h-full object-cover"
              loading="lazy"
            >
            <div v-else class="w-full h-72 lg:h-full flex items-center justify-center text-gray-400">
              {{ t('common.noImage') }}
            </div>
          </div>

          <div class="lg:col-span-3 p-5 sm:p-7">
            <h1 class="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
              {{ saint.name }}
            </h1>

            <div class="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
              <span class="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 ring-1 ring-gray-200">
                {{ t('saints.feastDay', { day: saint.feast_day || '-' }) }}
              </span>
              <span
                v-if="saint.patron_of"
                class="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 ring-1 ring-gray-200"
              >
                {{ t('saints.patronOf', { name: saint.patron_of }) }}
              </span>
            </div>

            <p v-if="saint.bio_snippet" class="mt-4 text-gray-700">
              {{ saint.bio_snippet }}
            </p>

            <div
              v-if="saint.content"
              class="mt-6 article-body prose prose-gray prose-lg max-w-none"
              v-html="saint.content"
            />
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
