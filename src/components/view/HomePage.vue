<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';
import { NewsService } from '../../services/NewsService';

const searchQuery = ref('')

const featuredArticles = ref([]);
const latestHeadlines = ref([]);
const newsCategories = ref([]);
const isLoading = ref(true);
const currentFeaturedIndex = ref(0);

const router = useRouter();

onMounted(async () => {
  try {
    const [articles, headlines, categories] = await Promise.all([
      NewsService.getFeaturedArticles(),
      NewsService.getLatestHeadlines(),
      NewsService.getNewsCategories()
    ]);
    featuredArticles.value = articles;
    latestHeadlines.value = headlines;
    newsCategories.value = categories;
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    // Handle error state in UI if necessary
  } finally {
    isLoading.value = false;
  }
});

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'searchResults', query: { q: searchQuery.value } });
  }
};
</script>
<template>
  <div class="homepage">
    <main class="mx-auto max-w-7xl p-8">
      <section class="mb-12">
        <h2 class="mb-6 border-b-2 border-blue-500 pb-2 text-2xl font-bold text-blue-500">Featured Articles</h2>
        <div v-if="featuredArticles.length > 0" class="relative">
          <!-- Slider Controls -->
          <button @click="prevArticle" class="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/50 p-2 text-gray-800 shadow-md hover:bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button @click="nextArticle" class="absolute right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/50 p-2 text-gray-800 shadow-md hover:bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Slider Content -->
          <div v-for="(article, index) in featuredArticles" :key="article.id">
            <div v-if="index === currentFeaturedIndex" class="grid grid-cols-1 items-center gap-8 overflow-hidden rounded-lg border border-gray-200 shadow-md md:grid-cols-2">
              <img :src="article.image" :alt="article.title" class="h-full w-full object-cover" />
              <div class="flex flex-col justify-center p-8">
                <h3 class="text-3xl font-bold">
                  <RouterLink :to="{ name: 'articleDetails', params: { id: article.id } }" class="text-gray-800 no-underline hover:text-blue-600">{{ article.title }}</RouterLink>
                </h3>
                <p class="my-4 text-lg text-gray-600">{{ article.snippet }}</p>
                <RouterLink :to="{ name: 'articleDetails', params: { id: article.id } }" class="self-start rounded bg-blue-500 px-4 py-2 font-bold text-white no-underline transition-colors hover:bg-blue-600">Read More</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <aside class="md:col-span-1">
          <h2 class="mb-6 border-b-2 border-blue-500 pb-2 text-2xl font-bold text-blue-500">Categories</h2>
          <ul class="list-none p-0">
            <li v-for="category in newsCategories" :key="category">
              <RouterLink :to="{ name: 'categoryView', params: { name: category } }" class="block border-b border-gray-200 py-3 text-gray-700 no-underline transition-colors duration-300 hover:text-blue-500">{{ category }}</RouterLink>
            </li>
          </ul>
        </aside>

        <section class="md:col-span-2">
          <h2 class="mb-6 border-b-2 border-blue-500 pb-2 text-2xl font-bold text-blue-500">Latest Headlines</h2>
          <ul class="list-none p-0">
            <li v-for="headline in latestHeadlines" :key="headline.id">
              <RouterLink :to="{ name: 'articleDetails', params: { id: headline.id } }" class="flex items-center justify-between border-b border-gray-200 py-3 text-gray-800 no-underline transition-colors duration-300 hover:text-blue-500">
                <span class="font-medium">{{ headline.title }}</span>
                <span class="ml-4 whitespace-nowrap rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">{{ headline.category }}</span>
              </RouterLink>
            </li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* All styles have been converted to Tailwind CSS classes in the template. */
</style>
