<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const searchQuery = ref('');
const searchResults = ref([]);

const performSearch = (query) => {
  // In a real app, you would fetch search results based on the query.
  searchResults.value = [
    { id: 101, title: `Result for "${query}" - Item 1`, snippet: 'A short snippet of the first search result.', date: '2023-10-26', thumbnail: 'https://via.placeholder.com/100x80?text=Result1' },
    { id: 102, title: `Result for "${query}" - Item 2`, snippet: 'Another short snippet for the second result.', date: '2023-10-25', thumbnail: 'https://via.placeholder.com/100x80?text=Result2' },
  ];
};

onMounted(() => {
  searchQuery.value = route.query.q || '';
  if (searchQuery.value) {
    performSearch(searchQuery.value);
  }
});

watch(() => route.query.q, (newQuery) => {
  searchQuery.value = newQuery || '';
  performSearch(searchQuery.value);
});
</script>

<template>
  <div class="search-results-page">
    <h1>Search Results for "{{ searchQuery }}"</h1>
    <div v-if="searchResults.length">
      <div v-for="result in searchResults" :key="result.id" class="search-result-item">
        <img :src="result.thumbnail" :alt="result.title" class="thumbnail" />
        <div class="details">
          <h3>{{ result.title }}</h3>
          <p>{{ result.snippet }}</p>
          <span class="date">{{ result.date }}</span>
        </div>
      </div>
    </div>
    <p v-else>No results found.</p>
    <!-- Placeholder for pagination and filtering options -->
  </div>
</template>

<style scoped>
.search-results-page {
  max-width: 900px;
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
.search-result-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}
.thumbnail {
  width: 100px;
  height: 80px;
  object-fit: cover;
  margin-right: 1rem;
  border-radius: 4px;
}
.details h3 {
  margin-top: 0;
  font-size: 1.1rem;
  color: #333;
}
.details p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}
.details .date {
  font-size: 0.8rem;
  color: #999;
}
</style>