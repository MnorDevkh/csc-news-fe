<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { ArrowRightOutlined } from '@ant-design/icons-vue';
import { NewsService } from '@/services/NewsService';

const newsCategories = ref([]);
const isLoadingCategories = ref(false);
const pageTitle = ref('');
const pageSubtitle = ref('');

const activeCategories = computed(() =>
  (newsCategories.value || []).filter((c) => c.status === 'active')
);

function setPageMeta(meta) {
  if (!meta) {
    pageTitle.value = '';
    pageSubtitle.value = '';
    return;
  }
  pageTitle.value = meta.title || '';
  pageSubtitle.value = meta.subtitle || '';
}

onMounted(async () => {
  try {
    isLoadingCategories.value = true;
    const categories = await NewsService.getNewsCategories();
    newsCategories.value = categories || [];
  } catch (error) {
    console.error('Failed to load categories for sidebar', error);
  } finally {
    isLoadingCategories.value = false;
  }
});
</script>

<template>
  <div class="homepage bg-[#f8f9fa] min-h-screen pb-12 font-sans flex flex-col items-center">
    <div class="w-full max-w-[1400px] px-0 lg:px-10 mx-auto">
      <header v-if="pageTitle" class="mt-6 sm:mt-8 mb-6 sm:mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-2xl tracking-tight pt-6 ">
          {{ pageTitle }}
        </h1>
        <p v-if="pageSubtitle" class="mt-3 text-base sm:text-lg text-gray-500">
          {{ pageSubtitle }}
        </p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-16">
        <!-- Main content (Left 2 cols) -->
        <section class="lg:col-span-2">
          <RouterView v-slot="{ Component }">
            <component :is="Component" :setPageMeta="setPageMeta" />
          </RouterView>
        </section>

        <!-- Sidebar (Right 1 col) -->
        <aside class="lg:col-span-1">
          <div class="sticky top-6 p-2">
            <slot name="sidebar">
              <div class="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-6 m-2">
                <h2 class="text-lg font-bold text-gray-900 mb-4 pb-3 relative">
                  មាតិការ
                  <span class="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-[#d4a853] to-transparent rounded-full"></span>
                </h2>
                <div v-if="isLoadingCategories" class="text-sm text-gray-400">
                  Loading categories...
                </div>
                <ul v-else class="space-y-2">
                  <li v-for="category in activeCategories" :key="category.id">
                    <RouterLink
                      :to="{ name: 'categoryView', params: { name: category.name } }"
                      class="flex items-center justify-between p-2.5 rounded-xl text-gray-600 hover:bg-[#1a365d]/[0.04] hover:text-[#1a365d] transition-all duration-200 group text-sm"
                    >
                      <span>{{ category.name }}</span>
                      <ArrowRightOutlined
                        class="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </slot>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

