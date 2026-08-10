<script setup>
import { ref, computed, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ArrowRightOutlined } from '@ant-design/icons-vue';
import { NewsService } from '@/services/NewsService';
import { useSiteLanguage } from '@/composables/useSiteLanguage';

const { t } = useI18n();
const { lang } = useSiteLanguage();

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

async function loadCategories() {
  try {
    isLoadingCategories.value = true;
    const categories = await NewsService.getNewsCategories(lang.value);
    newsCategories.value = categories || [];
  } catch (error) {
    console.error('Failed to load categories for sidebar', error);
    newsCategories.value = [];
  } finally {
    isLoadingCategories.value = false;
  }
}

watch(lang, () => {
  loadCategories();
}, { immediate: true });
</script>

<template>
  <div class="min-h-screen pb-12 flex flex-col items-center bg-transparent">
    <div class="container-site w-full mx-auto">
      <header v-if="pageTitle" class="mt-6 sm:mt-8 mb-6 sm:mb-8">
        <h1 class="font-display text-3xl font-semibold text-navy sm:text-4xl tracking-tight m-0">
          {{ pageTitle }}
        </h1>
        <div class="gold-rule-left mt-3"></div>
        <p v-if="pageSubtitle" class="mt-3 text-base sm:text-lg text-ink-soft m-0">
          {{ pageSubtitle }}
        </p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
        <section class="lg:col-span-2 min-w-0">
          <RouterView v-slot="{ Component }">
            <component :is="Component" :setPageMeta="setPageMeta" />
          </RouterView>
        </section>

        <aside class="lg:col-span-1">
          <div class="sticky top-24">
            <slot name="sidebar">
              <div class="panel p-5 sm:p-6">
                <h2 class="font-display text-lg text-navy mb-1 m-0">
                  {{ t('category.sidebarTitle') }}
                </h2>
                <div class="gold-rule-left mt-2 mb-4"></div>
                <div v-if="isLoadingCategories" class="text-sm text-muted">
                  {{ t('category.loading') }}
                </div>
                <ul v-else class="space-y-1 list-none p-0 m-0">
                  <li v-for="category in activeCategories" :key="category.id">
                    <RouterLink
                      :to="{ name: 'categoryView', params: { name: category.slug } }"
                      class="flex items-center justify-between p-2.5 text-ink-soft hover:bg-cream hover:text-burgundy transition-all duration-200 group text-sm no-underline"
                    >
                      <span>{{ category.name }}</span>
                      <ArrowRightOutlined
                        class="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity"
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
