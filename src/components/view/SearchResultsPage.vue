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
  <div class="w-full min-h-[50vh] flex justify-center items-start py-6 sm:py-10 box-border">
    <div class="w-full max-w-4xl mx-auto">

      <div class="mb-8">
        <h1 class="font-display text-3xl font-semibold text-navy mb-2 m-0">
          {{ t('search.title') }}
        </h1>
        <div class="gold-rule-left mt-3 mb-3"></div>
        <p class="text-ink-soft text-lg m-0">
          {{ t('search.found', { count: results.length }) }}
          <span class="font-semibold text-burgundy">"{{ query }}"</span>
        </p>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <a-spin size="large" />
      </div>

      <div v-else-if="results.length > 0" class="space-y-3">
        <div
          v-for="item in results"
          :key="item.id"
          class="panel p-5 sm:p-6 cursor-pointer group card-hover"
          @click="router.push(articlePublicPath(item, lang))"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span class="bg-primary-light text-primary text-xs px-2 py-1 font-medium uppercase">{{
                  item.category }}</span>
                <span class="text-xs text-muted">{{ item.date }}</span>
              </div>
              <h3 class="font-display text-xl font-semibold text-navy group-hover:text-burgundy transition-colors mb-2 m-0">
                {{ item.title }}
              </h3>
              <p class="text-ink-soft line-clamp-2 m-0">
                {{ item.snippet }}
              </p>
            </div>
            <div
              class="hidden sm:flex h-10 w-10 border border-line items-center justify-center group-hover:border-gold shrink-0">
              <ArrowRightOutlined class="text-muted group-hover:text-burgundy" />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16 panel">
        <SearchOutlined class="text-5xl text-line mb-4" />
        <h3 class="font-display text-xl text-navy m-0 mb-2">{{ t('search.noResults') }}</h3>
        <p class="text-muted m-0">{{ t('search.tryAdjusting') }}</p>
      </div>

    </div>
  </div>
</template>
