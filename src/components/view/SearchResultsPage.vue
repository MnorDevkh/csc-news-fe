<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const query = computed(() => route.query.q);
</script>

<template>
  <div class="search-results-page">
    <h1>Search Results for: "{{ query }}"</h1>
    <p>Displaying results for your search...</p>
  </div>
</template>

<style scoped>
.search-results-page {
  padding: 2rem;
}
</style>