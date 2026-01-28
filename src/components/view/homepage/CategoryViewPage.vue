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
  <div class="mx-auto max-w-6xl rounded-lg bg-white p-8 ">
    <h1 class="mb-6 text-3xl font-bold text-blue-500">Category: {{ categoryName }}</h1>
    <div v-if="articles.length">
      <RouterLink v-for="article in articles" :key="article.id"
        :to="{ name: 'articleDetails', params: { id: article.id } }"
        class="mb-4 flex gap-6 rounded-lg border-b border-gray-200 p-4 text-inherit no-underline transition-all duration-200 ease-in-out hover:bg-gray-50 hover:shadow-md">
        <div class="flex-1">
          <h3 class="mt-0 text-xl font-medium text-gray-800">{{ article.title }}</h3>
          <p class="mb-2 text-sm text-gray-600">{{ article.snippet }}</p>
          <span class="text-xs text-gray-500">{{ article.date }}</span>
        </div>
        <div>
          <img :src="article.image" :alt="article.title" class="h-24 w-36 rounded-md object-cover" />
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