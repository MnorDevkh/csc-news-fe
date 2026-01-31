<script setup>
import { ref, watch, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useRoute } from 'vue-router';

const route = useRoute();
const categoryName = ref('');
const articles = ref([]);

const fetchArticlesByCategory = (category) => {
  // In a real app, you would fetch articles for the given category.
  articles.value = [ // Added image property
    { id: 201, title: `Article 1 in ${category}`, snippet: `This is the first article in the ${category} category.`, date: '2023-10-27', image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=400' },
    { id: 202, title: `Article 2 in ${category}`, snippet: `This is the second article in the ${category} category.`, date: '2023-10-26', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400' },
  ];
};

onMounted(() => {
  categoryName.value = route.params.name || 'All';
  fetchArticlesByCategory(categoryName.value);
});

watch(() => route.params.name, (newName) => {
  categoryName.value = newName || 'All';
  fetchArticlesByCategory(categoryName.value);
});
</script>

<template>
  <div class="mx-auto max-w-6xl rounded-lg bg-white p-4 sm:p-8">
    <h1 class="mb-6 text-2xl sm:text-3xl font-bold text-blue-600">Category: {{ categoryName }}</h1>
    <div v-if="articles.length" class="space-y-4">
      <RouterLink v-for="article in articles" :key="article.id"
        :to="{ name: 'articleDetails', params: { id: article.id } }"
        class="flex flex-col sm:flex-row gap-6 rounded-lg border border-gray-100 p-4 transition-all duration-200 hover:shadow-lg hover:border-blue-100 group">
        <div class="w-full sm:w-48 flex-shrink-0">
          <img :src="article.image" :alt="article.title"
            class="h-48 sm:h-32 w-full rounded-lg object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{{
              article.title }}</h3>
            <p class="text-gray-600 line-clamp-2 mb-2">{{ article.snippet }}</p>
          </div>
          <span class="text-xs text-gray-400 font-medium">{{ article.date }}</span>
        </div>
      </RouterLink>
    </div>
    <p v-else class="text-gray-500">No articles found in this category.</p>
    <!-- Placeholder for sorting options -->
  </div>
</template>

<style scoped>
/* All styles have been converted to Tailwind CSS classes in the template. */
</style>