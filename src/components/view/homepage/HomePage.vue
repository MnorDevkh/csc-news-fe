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
const hasError = ref(false);
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
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
});

const activeCategories = computed(() =>
  (newsCategories.value || []).filter((c) => c.status === 'active')
);

// Build hierarchy like Menu: parents (no parent_id) with their children, sorted by order_no
const hierarchicalCategories = computed(() => {
  const categories = activeCategories.value;
  const parents = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => (a.order_no ?? 0) - (b.order_no ?? 0));
  return parents.map((parent) => {
    const children = categories
      .filter((c) => c.parent_id === parent.id)
      .sort((a, b) => (a.order_no ?? 0) - (b.order_no ?? 0));
    return { parent, children };
  });
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
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="py-8 space-y-10 animate-pulse">
        <div class="rounded-2xl overflow-hidden bg-gray-200 h-[500px] md:h-[600px]" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="n in 4" :key="n" class="bg-white p-6 rounded-2xl">
            <div class="h-14 w-14 bg-gray-200 rounded-full mx-auto mb-4" />
            <div class="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
            <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 bg-white rounded-2xl p-4 space-y-4">
            <div v-for="n in 4" :key="n" class="flex gap-4">
              <div class="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
              <div class="flex-1 space-y-2 py-1">
                <div class="h-5 bg-gray-200 rounded w-3/4" />
                <div class="h-4 bg-gray-200 rounded w-full" />
                <div class="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl p-6 space-y-3">
            <div class="h-6 bg-gray-200 rounded w-1/2 mb-4" />
            <div v-for="n in 5" :key="n" class="h-10 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="py-16 flex flex-col items-center justify-center text-center">
        <div class="bg-white rounded-2xl shadow-sm border border-red-100 p-10 max-w-md w-full">
          <div class="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <span class="text-3xl text-red-400">!</span>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Something went wrong</h3>
          <p class="text-gray-500 text-sm mb-6">Failed to load homepage content. Please check your connection and try again.</p>
          <button @click="() => { hasError = false; isLoading = true; location.reload(); }"
            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
      <template v-else>

      <!-- Hero Section -->
      <section class="py-8 [&_.slick-slide]:text-center [&_.slick-slide]:h-auto [&_.slick-slide]:leading-normal [&_.slick-slide]:overflow-hidden [&_.slick-slide_h3]:text-white">
        <a-carousel autoplay class="rounded-2xl overflow-hidden shadow-xl">
          <div v-for="article in featuredArticles.slice(0, 4)" :key="article.id"
            class="relative h-[500px] md:h-[600px] w-full cursor-pointer"
            @click="router.push({ name: 'articleDetails', params: { id: article.id } })">
            <img :src="article.thumbnail" :alt="article.title" class="h-full w-full object-cover" />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
              <div class="flex items-center gap-3 mb-3">
                <span v-if="article.category?.name"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                  {{ article.category.name }}
                </span>
                <span v-if="article.publish_at" class="text-gray-300 text-sm">
                  {{ formatDate(article.publish_at) }}
                </span>
                <span v-if="article.reading_time" class="text-gray-300 text-sm">
                  · {{ article.reading_time }} min read
                </span>
              </div>
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
          <RouterLink to="/news"
            class="bg-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group text-center flex flex-col items-center no-underline">
            <div
              class="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300">
              <TeamOutlined class="text-2xl text-blue-500 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">ពត៍មានព្រះសហគមន៍</h3>
            <p class="text-gray-500 text-sm mb-0">ពត៍មានភូមិភាគ និងសកម្មភាពផ្សេងៗ</p>
          </RouterLink>
          <RouterLink to="/read"
            class="bg-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group text-center flex flex-col items-center no-underline">
            <div
              class="h-14 w-14 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors duration-300">
              <ReadOutlined class="text-2xl text-indigo-500 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">ព្រះគម្ពីរ</h3>
            <p class="text-gray-500 text-sm mb-0">អត្ថបទ និងការសិក្សាព្រះគម្ពីរ</p>
          </RouterLink>
          <RouterLink :to="{ name: 'saintList' }"
            class="bg-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group text-center flex flex-col items-center no-underline">
            <div
              class="h-14 w-14 bg-amber-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors duration-300">
              <FireOutlined class="text-2xl text-amber-500 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">សន្តសន្តី</h3>
            <p class="text-gray-500 text-sm mb-0">ប្រវត្តិ និងគំរូជីវិតសន្តបុគ្គល</p>
          </RouterLink>
          <RouterLink :to="{ name: 'galleryGridView' }"
            class="bg-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group text-center flex flex-col items-center no-underline">
            <div
              class="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors duration-300">
              <PictureOutlined class="text-2xl text-emerald-500 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">កម្រងរូបភាព</h3>
            <p class="text-gray-500 text-sm mb-0">រូបភាពសកម្មភាព និងពិធីបុណ្យ</p>
          </RouterLink>
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
            <div v-if="latestHeadlines.length === 0" class="p-4 text-center text-gray-400 text-sm">
              No latest news available.
            </div>
            <ul v-else class="divide-y divide-gray-100">
              <li v-for="headline in latestHeadlines" :key="headline.id" class="group">
                <RouterLink :to="{ name: 'articleDetails', params: { id: headline.id } }"
                  class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div class="w-28 h-[76px] flex-shrink-0 rounded-l overflow-hidden bg-gray-100">
                    <img v-if="headline.thumbnail" :src="headline.thumbnail" :alt="headline.title"
                      class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  </div>
                  <div class="flex-1 min-w-0 flex flex-col justify-center">
                    <h4
                      class="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-1">
                      {{ headline.title }}</h4>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span v-if="headline.category?.name"
                        class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700">
                        {{ headline.category.name }}
                      </span>
                      <span class="text-xs text-gray-400">{{ formatDate(headline.publish_at) }}</span>
                      <span v-if="headline.reading_time" class="text-xs text-gray-400">· {{ headline.reading_time }} min</span>
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
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">មាតិការ</h2>
              <div v-if="hierarchicalCategories.length === 0" class="text-gray-400 text-sm">
                No categories available.
              </div>
              <ul v-else class="space-y-1">
                <template v-for="({ parent, children }) in hierarchicalCategories" :key="parent.id">
                  <!-- Parent with children: show as group -->
                  <li v-if="children.length > 0" class="pt-2 first:pt-0">
                    <div class="text-sm font-semibold text-gray-700 px-2 py-1.5">{{ parent.name }}</div>
                    <ul class="ml-3 mt-0.5 space-y-0.5 border-l border-gray-200 pl-2">
                      <li v-for="child in children" :key="child.id">
                        <RouterLink :to="{ name: 'categoryView', params: { name: child.name } }"
                          class="flex items-center justify-between py-1.5 px-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200 group text-sm">
                          <span>{{ child.name }}</span>
                          <ArrowRightOutlined class="text-xs opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </RouterLink>
                      </li>
                    </ul>
                  </li>
                  <!-- Parent without children: single link -->
                  <li v-else>
                    <RouterLink :to="{ name: 'categoryView', params: { name: parent.name } }"
                      class="flex items-center justify-between p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200 group">
                      <span>{{ parent.name }}</span>
                      <ArrowRightOutlined class="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                    </RouterLink>
                  </li>
                </template>
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
      </template>
    </main>
  </div>
</template>
