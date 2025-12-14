<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';
import { NewsService } from '../../services/NewsService';
import GalleryGridViewPage from './GalleryGridViewPage.vue';



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


</script>
<template>
  <div class="homepage">
    <main class="mx-auto">
      <section class="mb-12 p-4 m-auto justify-center">
        <a-carousel autoplay>
          <div v-for="article in featuredArticles.slice(0, 4)" :key="article.id" class="relative h-[600px] w-full">
            <img :src="article.image" :alt="article.title" class="h-full w-full object-cover" />
            <div class="absolute bottom-0 w-full bg-black bg-opacity-50 p-4 text-left">
              <h3 class="text-2xl font-bold text-white">{{ article.title }}</h3>
              <p class="text-white">{{ article.snippet }}</p>
            </div>
          </div>
        </a-carousel>
      </section>
      <section class="mb-12 p-4 m-auto justify-center">
        <h2 class="mb-6 border-b-2 border-blue-500 pb-2 text-2xl font-bold text-blue-500">លក្ខណៈពិសេស</h2>
        <div class=" space-x-4 overflow-x-auto p-4 m-auto">
          <div class="flex space-x-4 justify-between">
            <a-card class="w-2/9 ">
              <h2 class="text-2xl font-bold">ពត៍មានព្រះសហគមន៍</h2>
              <p class="text-xl font-bold">ពត៍មានភូមិភាគ</p>
              <p>Card content</p>
            </a-card>
            <a-card class="w-2/9">
              <h2 class="text-2xl font-bold">ព្រះគម្ពីរ</h2>
              <p class="text-xl font-bold">Card content</p>
            </a-card>
            <a-card class="w-2/9">
              <h2 class="text-2xl font-bold">សន្តសន្តី</h2>
            </a-card>
            <a-card class="w-2/9">
              <h2 class="text-2xl font-bold">កម្រងរូបភាព</h2>
            </a-card>
          </div>

        </div>
      </section>
      <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <aside class="md:col-span-1">
          <h2 class="mb-6 border-b-2 border-blue-500 pb-2 text-2xl font-bold text-blue-500">មាតិការ</h2>
          <ul class="list-none p-0">
            <li v-for="category in newsCategories" :key="category">
              <RouterLink :to="{ name: 'categoryView', params: { name: category } }"
                class="block border-b border-gray-200 py-3 text-gray-700 no-underline transition-colors duration-300 hover:text-blue-500">
                {{ category }}</RouterLink>
            </li>
          </ul>
        </aside>

        <section class="md:col-span-2">
          <h2 class="mb-6 border-b-2 border-blue-500 pb-2 text-2xl font-bold text-blue-500">ព័ត៌មានថ្មីៗបំផុត</h2>
          <ul class="list-none p-0">
            <li v-for="headline in latestHeadlines" :key="headline.id">
              <RouterLink :to="{ name: 'articleDetails', params: { id: headline.id } }"
                class="flex items-center justify-between border-b border-gray-200 py-3 text-gray-800 no-underline transition-colors duration-300 hover:text-blue-500">
                <span class="font-medium">{{ headline.title }}</span>
                <span class="ml-4 whitespace-nowrap rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">{{
                  headline.category }}</span>
              </RouterLink>
            </li>
          </ul>
        </section>
      </div>
      <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 w-7xl">
        <!-- <aside class="md:col-span-1">
          <h2 class="mb-6 border-b-2 border-blue-500 pb-2 text-2xl font-bold text-blue-500">មាតិការ</h2>
          <ul class="list-none p-0">
            <li v-for="category in newsCategories" :key="category">
              <RouterLink :to="{ name: 'categoryView', params: { name: category } }"
                class="block border-b border-gray-200 py-3 text-gray-700 no-underline transition-colors duration-300 hover:text-blue-500">
                {{ category }}</RouterLink>
            </li>
          </ul>
        </aside> -->

        <section class="md:col-span-3">
          <div class="mb-6 border-b-2 border-blue-500 pb-2 text-2xl font-bold text-blue-500 justify-between flex">
            <h2>កម្រងរូបភាព</h2>
            <button>មើលបន្ថែម</button>

          </div>
          <div>
            <GalleryGridViewPage />
          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<style scoped>
:deep(.slick-slide) {
  text-align: center;
  height: auto;
  line-height: normal;
  background: #364d79;
  overflow: hidden;
}

:deep(.slick-slide h3) {
  color: #fff;
}
</style>
