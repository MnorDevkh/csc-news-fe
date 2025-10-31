<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, watch } from 'vue';
import { NewsService } from './NewsService.js';
import { RouterLink } from 'vue-router';

const route = useRoute();
const query = computed(() => route.query.q);

const searchResults = ref([]);
const isLoading = ref(false);

const fetchResults = async (searchQuery) => {
  if (!searchQuery) {
    searchResults.value = [];
    return;
  }
  isLoading.value = true;
  try {
    searchResults.value = await NewsService.searchArticles(searchQuery);
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Watch for changes in the route query and fetch new results
watch(query, (newQuery) => {
  fetchResults(newQuery);
}, { immediate: true }); // `immediate: true` runs the watcher on component load

</script>

<template>
  <div class="search-results-page">
    <h1>Search Results for: "{{ query }}"</h1>

    <div v-if="isLoading" class="loading">
      <p>Searching...</p>
    </div>
    <div v-else-if="searchResults.length > 0" class="results-list">
      <ul>
        <li v-for="article in searchResults" :key="article.id">
          <RouterLink :to="{ name: 'articleDetails', params: { id: article.id } }">
            <span class="article-title">{{ article.title }}</span>
            <span class="category-tag">{{ article.category }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>
    <div v-else class="no-results">
      <p>No articles found matching your search.</p>
    </div>
  </div>
</template>

<style scoped>
.search-results-page {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.loading, .no-results {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}

.results-list ul {
  list-style: none;
  padding: 0;
  margin-top: 2rem;
}

.results-list li a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-decoration: none;
  color: #333;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.results-list li a:hover {
  border-color: #ddd;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.article-title {
  font-weight: 500;
}

.category-tag {
  background-color: #f0f0f0;
  color: #555;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  margin-left: 1rem;
}
</style>