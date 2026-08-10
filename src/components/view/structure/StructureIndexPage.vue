<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { RightOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { StructurePageService } from '@/services/StructurePageService';

const router = useRouter();
const { t } = useI18n();
const pages = ref([]);
const isLoading = ref(true);
const hasError = ref(false);

async function load() {
  isLoading.value = true;
  hasError.value = false;
  try {
    const data = await StructurePageService.listPublic();
    pages.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error(e);
    hasError.value = true;
    pages.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div
    class="structure-index min-h-screen bg-gray-50/80 font-[Kantumruy_Pro,'Khmer','Koh_Santepheap',sans-serif] flex justify-center"
  >
    <div class="w-full max-w-7xl px-3 py-6 sm:px-4 sm:py-10">
      <header class="mb-8 sm:mb-10">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight m-0">
          {{ t('structure.title') }}
        </h1>
        <p class="mt-2 text-gray-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          {{ t('structure.subtitle') }}
        </p>
      </header>

      <div v-if="isLoading" class="grid gap-4 sm:grid-cols-2">
        <div
          v-for="n in 4"
          :key="n"
          class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse h-32"
        />
      </div>

      <div
        v-else-if="hasError"
        class="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm"
      >
        <ExclamationCircleOutlined class="text-4xl text-gray-300 mb-3" />
        <p class="text-gray-700 font-medium mb-4">{{ t('structure.loadFailed') }}</p>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200"
          @click="load"
        >
          <ReloadOutlined /> {{ t('common.tryAgain') }}
        </button>
      </div>

      <ul v-else class="grid gap-4 sm:grid-cols-2 list-none m-0 p-0">
        <li v-for="p in pages" :key="p.slug">
          <button
            type="button"
            class="group w-full text-left rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm hover:border-primary/25 hover:shadow-md transition-all"
            @click="router.push({ name: 'structurePage', params: { slug: p.slug } })"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-900 m-0 group-hover:text-primary transition-colors">
                  {{ p.title || p.slug }}
                </h2>
                <p
                  v-if="p.excerpt"
                  class="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed m-0"
                >
                  {{ p.excerpt }}
                </p>
              </div>
              <RightOutlined class="text-primary/70 shrink-0 mt-1" />
            </div>
          </button>
        </li>
      </ul>

      <footer class="mt-10 pt-6 border-t border-gray-200">
        <button
          type="button"
          class="text-sm text-gray-500 hover:text-primary font-medium"
          @click="router.push({ name: 'home' })"
        >
          ← {{ t('structure.backToHome') }}
        </button>
      </footer>
    </div>
  </div>
</template>
