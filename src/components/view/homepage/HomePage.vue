<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';
import { NewsService } from '../../../services/NewsService';
import { ReadOutlined, PictureOutlined, TeamOutlined, FireOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';
import Saint from './Saint.vue';
import GalleryGridViewPage from './GalleryGridViewPage.vue';
import DailyBible from './DailyBible.vue';
import DailySermon from './DailySermon.vue';

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

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};



</script>
<template>
  <div class="homepage bg-gray-50 min-h-screen pb-12 font-sans flex flex-col items-center">
    <main class="w-full max-w-[1400px] px-4  mx-auto">

      <!-- Hero Section -->
      <section class="py-8 [&_.slick-slide]:text-center [&_.slick-slide]:h-auto [&_.slick-slide]:leading-normal [&_.slick-slide]:overflow-hidden [&_.slick-slide_h3]:text-white">
        <a-carousel autoplay class="rounded-2xl overflow-hidden shadow-xl">
          <div v-for="article in featuredArticles.slice(0, 4)" :key="article.id"
            class="relative h-[500px] md:h-[600px] w-full">
            <img :src="article.thumbnail" :alt="article.title" class="h-full w-full object-cover" />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
              <h3 class="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">{{ article.title }}</h3>
              <p class="text-gray-200 text-lg line-clamp-2 max-w-3xl drop-shadow-sm">{{ article.excerpt }}</p>
            </div>
          </div>
        </a-carousel>
      </section>

      <!-- Feature Cards -->
      <section class="mb-16">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-4">លក្ខណៈពិសេស
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Card 1 -->
          <div
            class="bg-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group text-center flex flex-col items-center">
            <div
              class="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
              <TeamOutlined class="text-2xl text-blue-500 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">ពត៍មានព្រះសហគមន៍</h3>
            <p class="text-gray-500 text-sm">ពត៍មានភូមិភាគ និងសកម្មភាពផ្សេងៗ</p>
          </div>
          <!-- Card 2 -->
          <div
            class="bg-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group text-center flex flex-col items-center">
            <div
              class="h-14 w-14 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors duration-300">
              <ReadOutlined class="text-2xl text-indigo-500 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">ព្រះគម្ពីរ</h3>
            <p class="text-gray-500 text-sm">អត្ថបទ និងការសិក្សាព្រះគម្ពីរ</p>
          </div>
          <!-- Card 3 -->
          <div
            class="bg-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group text-center flex flex-col items-center">
            <div
              class="h-14 w-14 bg-amber-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors duration-300">
              <FireOutlined class="text-2xl text-amber-500 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">សន្តសន្តី</h3>
            <p class="text-gray-500 text-sm">ប្រវត្តិ និងគំរូជីវិតសន្តបុគ្គល</p>
          </div>
          <!-- Card 4 -->
          <div
            class="bg-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group text-center flex flex-col items-center">
            <div
              class="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors duration-300">
              <PictureOutlined class="text-2xl text-emerald-500 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">កម្រងរូបភាព</h3>
            <p class="text-gray-500 text-sm">រូបភាពសកម្មភាព និងពិធីបុណ្យ</p>
          </div>
        </div>
      </section>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

        <!-- Latest News (Left 2 cols) -->
        <section class="lg:col-span-2">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4">ព័ត៌មានថ្មីៗបំផុត</h2>
            <RouterLink to="/news" class="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm">
              មើលទាំងអស់
              <ArrowRightOutlined class="ml-1 text-xs" />
            </RouterLink>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ul class="divide-y divide-gray-100">
              <li v-for="headline in latestHeadlines" :key="headline.id" class="group">
                <RouterLink :to="{ name: 'articleDetails', params: { id: headline.id } }"
                  class="flex items-start p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div class="flex-1">
                    <h4
                      class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                      {{ headline.title }}</h4>
                    <div class="flex items-center gap-2 mt-2">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ headline.category?.name }}
                      </span>
                      <span class="text-xs text-gray-400">{{ formatDate(headline.publish_at) }}</span>
                    </div>
                  </div>
                </RouterLink>
              </li>
            </ul>
          </div>
        </section>

        <!-- Sidebar (Right 1 col) -->
        <aside class="lg:col-span-1">
          <div class="sticky top-6 p-6">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 m-4">
              <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">មាតិការ</h2>
              <ul class="space-y-2">
                <li v-for="category in newsCategories" :key="category.id">
                  <RouterLink :to="{ name: 'categoryView', params: { name: category.name } }"
                    class="flex items-center justify-between p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group">
                    <span>{{ category.name }}</span>
                    <ArrowRightOutlined class="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <!-- Full Width Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

        <!-- Latest News (Left 2 cols) -->
        <section class="lg:col-span-2">
                   <div class="flex items-center justify-between mb-6">

            <h2 class="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-4">សន្តសន្តី
            </h2>
            <RouterLink :to="{ name: 'saintList' }"
              class="text-amber-600 hover:text-amber-800 font-medium flex items-center text-sm">
              មើលបន្ថែម
              <ArrowRightOutlined class="ml-1 text-xs" />
            </RouterLink>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <Saint />
          </div>
        </section>

        <!-- Sidebar (Right 1 col) -->
        <aside class="lg:col-span-1">
          <div class="sticky top-6 p-6">
            <!-- Ad/Promo Placeholder -->
            <div
              class="mt-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white text-center shadow-lg">
              <h3 class="text-xl font-bold mb-2">Subscribe Newsletter</h3>
              <p class="text-blue-100 text-sm mb-4">Get the latest catholic news directly to your inbox.</p>
              <button
                class="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors w-full">Subscribe
                Now</button>
            </div>
          </div>
        </aside>
      </div>


      <div class="space-y-16">


        <!-- Saint -->
        <section>

        </section>

        <!-- Bible & Sermon Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-4">អត្ថបទព្រះគម្ពីរប្រចាំថ្ងៃ
              </h2>
              <RouterLink :to="{ name: 'dailyBibleList' }"
                class="text-indigo-600 hover:text-indigo-800 font-medium flex items-center text-sm">
                មើលបន្ថែម
                <ArrowRightOutlined class="ml-1 text-xs" />
              </RouterLink>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <DailyBible :showControls="false" />
            </div>
          </section>

          <section>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-800 border-l-4 border-purple-500 pl-4">ធម្មទេសនា​ប្រចាំថ្ងៃ</h2>
              <RouterLink :to="{ name: 'dailySermonList' }"
                class="text-purple-600 hover:text-purple-800 font-medium flex items-center text-sm">
                មើលបន្ថែម
                <ArrowRightOutlined class="ml-1 text-xs" />
              </RouterLink>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <DailySermon />
            </div>
          </section>
        </div>


        <!-- Gallery -->
        <section>
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-4">កម្រងរូបភាព
            </h2>
            <RouterLink :to="{ name: 'galleryGridView' }"
              class="text-emerald-600 hover:text-emerald-800 font-medium flex items-center text-sm">
              មើលបន្ថែម
              <ArrowRightOutlined class="ml-1 text-xs" />
            </RouterLink>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <GalleryGridViewPage :showControls="false" />
          </div>
        </section>

      </div>
    </main>
  </div>
</template>
