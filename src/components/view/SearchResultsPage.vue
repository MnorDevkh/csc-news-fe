<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { SearchOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';
import { NewsService } from '@/services/NewsService';
import { useSiteLanguage } from '@/composables/useSiteLanguage';
import { articlePublicPath } from '@/utils/articleRoutes';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { lang } = useSiteLanguage();
const query = computed(() => route.query.q || '');
const results = ref([]);
const loading = ref(false);

const performSearch = async () => {
  if (!query.value) {
    results.value = [];
    return;
  }
  loading.value = true;
  try {
    const data = await NewsService.getAllArticles({
      search: query.value,
      lang: lang.value,
      public_only: true,
      limit: 50,
    });
    const items = data.items ?? data ?? [];
    results.value = items.map((a) => ({
      id: a.id,
      slug: a.slug,
      lang: a.lang,
      title: a.title,
      snippet: a.excerpt || '',
      date: a.publish_at || a.created_at,
      category: a.categories?.[0]?.name || 'News',
    }));
  } catch (err) {
    console.error('Search failed:', err);
    results.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (query.value) performSearch();
});

watch(query, () => {
  if (query.value) performSearch();
});

watch(lang, () => {
  if (query.value) performSearch();
});
</script>

<template>
  <div class="w-full min-h-screen flex justify-center items-start p-4 sm:p-6 lg:p-8 box-border bg-gray-50">
    <div class="w-full max-w-4xl mx-auto py-8 px-4 sm:py-10 sm:px-6 lg:py-12 lg:px-8">

      <div class="mb-8 text-center sm:text-left">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ t('search.title') }}
        </h1>
        <p class="text-gray-500 text-lg">
          {{ t('search.found', { count: results.length }) }} <span class="font-semibold text-blue-600">"{{ query }}"</span>
        </p>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <a-spin size="large" />
      </div>

      <div v-else-if="results.length > 0" class="space-y-4">
        <div v-for="item in results" :key="item.id"
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
          @click="router.push(articlePublicPath(item, lang))">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-medium uppercase">{{
                  item.category }}</span>
                <span class="text-xs text-gray-400">{{ item.date }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                {{ item.title }}
              </h3>
              <p class="text-gray-600 line-clamp-2">
                {{ item.snippet }}
              </p>
            </div>
            <div
              class="hidden sm:flex h-10 w-10 bg-gray-50 rounded-full items-center justify-center group-hover:bg-blue-50 transition-colors">
              <ArrowRightOutlined class="text-gray-400 group-hover:text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <SearchOutlined class="text-6xl text-gray-200 mb-4" />
        <h3 class="text-xl font-medium text-gray-500">{{ t('search.noResults') }}</h3>
        <p class="text-gray-400">{{ t('search.tryAdjusting') }}</p>
      </div>

    </div>
  </div>
</template>
