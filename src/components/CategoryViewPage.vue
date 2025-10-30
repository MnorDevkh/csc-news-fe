<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const categoryName = ref('');
const articles = ref([]);

const fetchArticlesByCategory = (category) => {
  // In a real app, you would fetch articles for the given category.
  articles.value = [
    { id: 201, title: `Article 1 in ${category}`, snippet: `This is the first article in the ${category} category.`, date: '2023-10-27' },
    { id: 202, title: `Article 2 in ${category}`, snippet: `This is the second article in the ${category} category.`, date: '2023-10-26' },
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
  <div class="category-view-page">
    <h1>Category: {{ categoryName }}</h1>
    <div v-if="articles.length">
      <div v-for="article in articles" :key="article.id" class="article-item">
        <h3>{{ article.title }}</h3>
        <p>{{ article.snippet }}</p>
        <span class="date">{{ article.date }}</span>
      </div>
    </div>
    <p v-else>No articles found in this category.</p>
    <!-- Placeholder for sorting options -->
  </div>
</template>

<style scoped>
.category-view-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
h1 {
  color: #007bff;
  margin-bottom: 1.5rem;
}
.article-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}
.article-item h3 {
  margin-top: 0;
  font-size: 1.1rem;
  color: #333;
}
.article-item p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}
.article-item .date {
  font-size: 0.8rem;
  color: #999;
}
</style>