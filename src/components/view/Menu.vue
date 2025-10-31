<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { NewsService } from '../../services/NewsService';


const newsCategories = ref([]);
const searchQuery = ref('');
const isMobileMenuOpen = ref(false);
const router = useRouter();

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'searchResults', query: { q: searchQuery.value } });

  }
};

onMounted(async () => {
  try {
    newsCategories.value = await NewsService.getNewsCategories();
  } catch (error) {
    console.error("Failed to fetch news categories:", error);
  }
});
</script>

<template>
  <div class="homepage">
    <header class="relative flex flex-wrap items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
      <div class="logo">
        <h1 class="text-2xl ">CSC News</h1>
      </div>
      <button class="z-50 block cursor-pointer p-2 lg:hidden" @click="isMobileMenuOpen = !isMobileMenuOpen" aria-label="Toggle menu">
        <span class="block h-0.5 w-6 bg-gray-800 transition-all duration-300" :class="{ 'translate-y-1.5 rotate-45': isMobileMenuOpen }"></span>
        <span class="my-1.5 block h-0.5 w-6 bg-gray-800 transition-all duration-300" :class="{ 'opacity-0': isMobileMenuOpen }"></span>
        <span class="block h-0.5 w-6 bg-gray-800 transition-all duration-300" :class="{ '-translate-y-1.5 -rotate-45': isMobileMenuOpen }"></span>
      </button>
      <div class="absolute left-0 top-full w-full flex-col items-start gap-4 bg-white p-8 shadow-md lg:relative lg:top-auto lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-6 lg:p-0 lg:shadow-none" :class="{ 'flex': isMobileMenuOpen, 'hidden': !isMobileMenuOpen }">
        <nav class="flex w-full flex-col items-start gap-2 lg:w-auto lg:flex-row lg:items-center lg:gap-0">
          <RouterLink :to="{ name: 'home' }" @click="isMobileMenuOpen = false" class="w-full border-b border-gray-200 py-2 font-medium text-gray-600 hover:text-blue-500 lg:mx-4 lg:w-auto lg:border-none lg:py-0">Home</RouterLink>
          <RouterLink 
            v-for="category in newsCategories.slice(0, 4)" 
            :key="category" 
            :to="{ name: 'categoryView', params: { name: category } }"
            @click="isMobileMenuOpen = false"
            class="w-full border-b border-gray-200 py-2 font-medium text-gray-600 hover:text-blue-500 lg:mx-4 lg:w-auto lg:border-none lg:py-0 px-3"
          >
            {{ category }}
          </RouterLink>
        </nav>
        <form class="flex w-full items-center lg:w-auto" @submit.prevent="performSearch">
          <input type="search" v-model="searchQuery" placeholder="Search for news..." class="flex-grow rounded-l-md border border-r-0 border-gray-300 p-2" />
          <button type="submit" class="cursor-pointer rounded-r-md border border-blue-500 bg-blue-500 px-4 py-2 text-white">Search</button>
        </form>
      </div>
    </header>
  </div>
</template>

<style scoped>
/* The scoped styles have been replaced with Tailwind CSS classes in the template. */
</style>
