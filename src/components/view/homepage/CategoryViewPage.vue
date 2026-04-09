<script setup>
import { ref, watch, onMounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { NewsService } from '@/services/NewsService';
import { CategoryService } from '@/services/CategoryService';

const route = useRoute();
const categoryName = ref('');
const categorySlug = ref('');
const articles = ref([]);
const isLoading = ref(true);
const hasError = ref(false);

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

async function fetchArticlesByCategory() {
  const slug = route.params.name;
  if (!slug) {
    articles.value = [];
    categoryName.value = 'All';
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  hasError.value = false;
  categorySlug.value = slug;

  try {
    const categories = await CategoryService.getAllCategories();
    const category = Array.isArray(categories)
      ? categories.find((c) => c.slug === slug)
      : null;

    if (!category) {
      categoryName.value = slug;
      articles.value = [];
      return;
    }

    categoryName.value = category.name;
    const data = await NewsService.getArticlesByCategory(category.id, {
      skip: 0,
      limit: 50,
    });

    const items = data.items ?? data ?? [];
    articles.value = items.map((a) => ({
      id: a.id,
      title: a.title,
      snippet: a.excerpt ?? a.snippet ?? '',
      date: a.publish_at ?? a.published_at ?? a.date ?? '',
      image: a.thumbnail ?? a.image ?? null,
      category: a.category,
    }));
  } catch (err) {
    console.error('Failed to load category articles:', err);
    hasError.value = true;
    articles.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchArticlesByCategory);

watch(
  () => route.params.name,
  () => {
    fetchArticlesByCategory();
  }
);
</script>

<template>
  <div class="w-full min-h-screen flex justify-center items-start px-3 py-3 sm:px-4 sm:py-4 box-border bg-[#f8f9fa]">
    <div class="w-full max-w-4xl mx-auto rounded-2xl bg-white p-3 sm:p-8 lg:p-8 lg:py-8 ring-1 ring-gray-100 shadow-sm">
      <h1 class="mb-6 text-2xl sm:text-3xl font-bold text-[#1a365d] relative pb-3">
        Category: {{ categoryName }}
        <span class="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#d4a853] to-transparent rounded-full"></span>
      </h1>

      <div v-if="isLoading" class="space-y-4 animate-pulse">
        <div v-for="i in 3" :key="i" class="flex flex-col sm:flex-row gap-6 rounded-md border border-gray-100 p-4">
          <div class="w-full sm:w-48 h-32 sm:h-32 bg-gray-200 rounded-md flex-shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-5 bg-gray-200 rounded w-3/4" />
            <div class="h-4 bg-gray-200 rounded w-full" />
            <div class="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>

      <p v-else-if="hasError" class="text-red-600">
        Failed to load articles. Please try again later.
      </p>

      <div v-else-if="articles.length" class="flex flex-col gap-6">
        <RouterLink
          v-for="article in articles"
          :key="article.id"
          :to="{ name: 'articleDetails', params: { id: article.id } }"
          class="flex flex-col sm:flex-row gap-4 rounded-2xl ring-1 ring-gray-100 p-4 h-[150px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:ring-[#1a365d]/15 group"
        >
          <div v-if="article.image" class="w-full sm:w-52 flex-shrink-0 h-full min-h-0">
            <img
              :src="article.image"
              :alt="article.title"
              class="w-full h-full rounded-md object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div class="flex-1 flex flex-col justify-between min-w-0 min-h-0">
            <div class="min-h-0 overflow-hidden">
              <h3 class="text-lg font-bold text-gray-800 mb-1 group-hover:text-[#1a365d] transition-colors line-clamp-2">
                {{ article.title }}
              </h3>
              <p class="text-gray-600 text-sm line-clamp-2">{{ article.snippet }}</p>
            </div>
            <span class="text-xs text-gray-400 font-medium shrink-0 mt-1">
              {{ formatDate(article.date) || article.date }}
            </span>
          </div>
        </RouterLink>
      </div>

      <p v-else class="text-gray-500">No articles found in this category.</p>
    </div>
  </div>
</template>
