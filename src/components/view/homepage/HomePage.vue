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
import MessengerListingPage from '../messenger/MessengerListingPage.vue';

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
  <div class="homepage bg-surface min-h-screen pb-8 sm:pb-12 font-sans flex flex-col items-center">
    <main class="w-full max-w-[1400px] px-0 mx-auto">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="py-5 sm:py-8 space-y-6 sm:space-y-10 animate-pulse">
        <div class="rounded-2xl overflow-hidden bg-stone-200 h-[420px] sm:h-[500px] md:h-[600px]" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div v-for="n in 4" :key="n" class="bg-surface-elevated ring-1 ring-black/5 p-6 rounded-2xl shadow-sm">
            <div class="h-14 w-14 bg-gray-200 rounded-full mx-auto mb-4" />
            <div class="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
            <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div class="lg:col-span-2 bg-surface-elevated ring-1 ring-black/5 rounded-2xl p-4 space-y-4 shadow-sm">
            <div v-for="n in 4" :key="n" class="flex gap-4">
              <div class="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
              <div class="flex-1 space-y-2 py-1">
                <div class="h-5 bg-gray-200 rounded w-3/4" />
                <div class="h-4 bg-gray-200 rounded w-full" />
                <div class="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
          <div class="bg-surface-elevated ring-1 ring-black/5 rounded-2xl p-6 space-y-3 shadow-sm">
            <div class="h-6 bg-gray-200 rounded w-1/2 mb-4" />
            <div v-for="n in 5" :key="n" class="h-10 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="py-16 flex flex-col items-center justify-center text-center">
        <div class="bg-surface-elevated rounded-2xl shadow-sm ring-1 ring-red-100/80 p-6 sm:p-10 max-w-md w-full">
          <div class="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <span class="text-3xl text-red-400">!</span>
          </div>
          <h3 class="text-xl font-bold text-stone-800 mb-2">Something went wrong</h3>
          <p class="text-stone-500 text-sm mb-6">Failed to load homepage content. Please check your connection and try again.</p>
          <button @click="() => { hasError = false; isLoading = true; location.reload(); }"
            class="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-hover">
            Try Again
          </button>
        </div>
      </div>
      <template v-else>

      <!-- Hero Section -->
      <section class="py-4 sm:py-8 [&_.slick-slide]:text-center [&_.slick-slide]:h-auto [&_.slick-slide]:leading-normal [&_.slick-slide]:overflow-hidden [&_.slick-slide_h3]:text-white">
        <a-carousel autoplay class="home-hero-carousel rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5">
          <div v-for="article in latestHeadlines.slice(0, 5)" :key="article.id"
            class="relative h-[420px] sm:h-[500px] md:h-[600px] w-full cursor-pointer"
            @click="router.push({ name: 'articleDetails', params: { id: article.id } })">
            <img :src="article.thumbnail" :alt="article.title" class="h-full w-full object-cover" />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col justify-end p-4 sm:p-8 md:p-12">
              <div class="flex items-center gap-3 mb-3">
                <span v-if="article.category?.name"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/25 text-white backdrop-blur-sm">
                  {{ article.category.name }}
                </span>
                <span v-if="article.publish_at" class="text-stone-200 text-sm">
                  {{ formatDate(article.publish_at) }}
                </span>
                <span v-if="article.reading_time" class="text-stone-200 text-sm">
                  · {{ article.reading_time }} min read
                </span>
              </div>
              <h3 class="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-md tracking-tight">{{ article.title }}</h3>
              <p class="text-stone-200 text-lg line-clamp-2 max-w-3xl drop-shadow-sm">{{ article.excerpt }}</p>
            </div>
          </div>
        </a-carousel>
      </section>

      <!-- Feature Cards -->
      <section class="mb-10 sm:mb-16 px-2 py-3 sm:px-4 sm:py-4">
        <div class="flex items-center justify-between mb-4 sm:mb-6 px-1 sm:px-2">
          <div class="flex items-center gap-3 min-w-0">
            <span class="h-8 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <h2 class="text-2xl font-bold text-stone-800 tracking-tight m-0">លក្ខណៈពិសេស</h2>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <RouterLink to="/news"
            class="bg-surface-elevated p-4 sm:p-6 rounded-2xl ring-1 ring-black/5 shadow-sm hover:shadow-md duration-200 ease-out hover:-translate-y-0.5 cursor-pointer group text-center flex flex-col items-center no-underline">
            <div
              class="h-14 w-14 bg-primary/12 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary duration-200">
              <TeamOutlined class="text-2xl text-primary group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold text-stone-800 mb-2">ពត៍មានព្រះសហគមន៍</h3>
            <p class="text-muted text-sm mb-0">ពត៍មានភូមិភាគ និងសកម្មភាពផ្សេងៗ</p>
          </RouterLink>
          <RouterLink to="/read"
            class="bg-surface-elevated p-4 sm:p-6 rounded-2xl ring-1 ring-black/5 shadow-sm hover:shadow-md duration-200 ease-out hover:-translate-y-0.5 cursor-pointer group text-center flex flex-col items-center no-underline">
            <div
              class="h-14 w-14 bg-sky-100/80 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary duration-200">
              <ReadOutlined class="text-2xl text-sky-700/90 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold text-stone-800 mb-2">ព្រះគម្ពីរ</h3>
            <p class="text-muted text-sm mb-0">អត្ថបទ និងការសិក្សាព្រះគម្ពីរ</p>
          </RouterLink>
          <RouterLink :to="{ name: 'saintList' }"
            class="bg-surface-elevated p-4 sm:p-6 rounded-2xl ring-1 ring-black/5 shadow-sm hover:shadow-md duration-200 ease-out hover:-translate-y-0.5 cursor-pointer group text-center flex flex-col items-center no-underline">
            <div
              class="h-14 w-14 bg-amber-100/70 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary duration-200">
              <FireOutlined class="text-2xl text-amber-800/80 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold text-stone-800 mb-2">សន្តសន្តី</h3>
            <p class="text-muted text-sm mb-0">ប្រវត្តិ និងគំរូជីវិតសន្តបុគ្គល</p>
          </RouterLink>
          <RouterLink :to="{ name: 'galleryGridView' }"
            class="bg-surface-elevated p-4 sm:p-6 rounded-2xl ring-1 ring-black/5 shadow-sm hover:shadow-md duration-200 ease-out hover:-translate-y-0.5 cursor-pointer group text-center flex flex-col items-center no-underline">
            <div
              class="h-14 w-14 bg-emerald-100/70 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary duration-200">
              <PictureOutlined class="text-2xl text-emerald-800/75 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold text-stone-800 mb-2">កម្រងរូបភាព</h3>
            <p class="text-muted text-sm mb-0">រូបភាពសកម្មភាព និងពិធីបុណ្យ</p>
          </RouterLink>
          <RouterLink :to="{ name: 'messengerList' }"
            class="bg-surface-elevated p-4 sm:p-6 rounded-2xl ring-1 ring-black/5 shadow-sm hover:shadow-md duration-200 ease-out hover:-translate-y-0.5 cursor-pointer group text-center flex flex-col items-center no-underline">
            <div
              class="h-14 w-14 bg-slate-200/80 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary duration-200">
              <ReadOutlined class="text-2xl text-slate-600 group-hover:text-white" />
            </div>
            <h3 class="text-xl font-bold text-stone-800 mb-2">The Messenger</h3>
            <p class="text-muted text-sm mb-0">Magazine issues in flipbook format</p>
          </RouterLink>
        </div>
      </section>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 mb-10 sm:mb-16">

        <!-- Latest News (Left 2 cols) -->
        <section class="lg:col-span-2 px-2 py-3 sm:px-4 sm:py-4">
          <div class="flex items-center justify-between mb-4 sm:mb-6 px-1 sm:px-2 gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <span class="h-8 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <h2 class="text-2xl font-bold text-stone-800 tracking-tight m-0">ព័ត៌មានថ្មីៗបំផុត</h2>
            </div>
            <RouterLink to="/news" class="text-primary hover:text-primary-hover font-medium flex items-center text-sm shrink-0">
              មើលទាំងអស់
              <ArrowRightOutlined class="ml-1 text-xs" />
            </RouterLink>
          </div>

            <div class="bg-surface-elevated rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden p-2 sm:p-4">
            <div v-if="latestHeadlines.length === 0" class="p-4 text-center text-stone-400 text-sm">
              No latest news available.
            </div>
            <ul v-else class="divide-y divide-stone-100">
              <li v-for="headline in latestHeadlines" :key="headline.id" class="group">
                <RouterLink :to="{ name: 'articleDetails', params: { id: headline.id } }"
                  class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-stone-50/80 duration-200 ease-out rounded-xl">
                  <div class="w-28 h-[76px] flex-shrink-0 rounded-lg overflow-hidden bg-stone-100 ring-1 ring-black/5">
                    <img v-if="headline.thumbnail" :src="headline.thumbnail" :alt="headline.title"
                      class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300" />
                  </div>
                  <div class="flex-1 min-w-0 flex flex-col justify-center">
                    <h4
                      class="text-base font-semibold text-stone-800 group-hover:text-primary duration-200 leading-snug line-clamp-2 mb-1">
                      {{ headline.title }}</h4>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span v-if="headline.category?.name"
                        class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary">
                        {{ headline.category.name }}
                      </span>
                      <span class="text-xs text-stone-400">{{ formatDate(headline.publish_at) }}</span>
                      <span v-if="headline.reading_time" class="text-xs text-stone-400">· {{ headline.reading_time }} min</span>
                    </div>
                  </div>
                </RouterLink>
              </li>
            </ul>
          </div>
        </section>
        <!-- Sidebar (Right 1 col) -->
        <aside class="lg:col-span-1 px-2 py-3 sm:px-4 sm:py-4">
          <div class="sticky top-6 p-3 sm:p-6">
            <div class="bg-surface-elevated rounded-2xl shadow-sm ring-1 ring-black/5 p-4 sm:p-6">
              <h2 class="text-xl font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">មាតិការ</h2>
              <div v-if="hierarchicalCategories.length === 0" class="text-stone-400 text-sm">
                No categories available.
              </div>
              <ul v-else class="space-y-1">
                <template v-for="({ parent, children }) in hierarchicalCategories" :key="parent.id">
                  <!-- Parent with children: show as group -->
                  <li v-if="children.length > 0" class="pt-2 first:pt-0">
                    <div class="text-sm font-semibold text-stone-700 px-2 py-1.5">{{ parent.name }}</div>
                    <ul class="ml-3 mt-0.5 space-y-0.5 border-l border-stone-200 pl-2">
                      <li v-for="child in children" :key="child.id">
                        <RouterLink :to="{ name: 'categoryView', params: { name: child.name } }"
                          class="flex items-center justify-between py-1.5 px-2 rounded-lg text-stone-600 hover:bg-stone-50 duration-200 ease-out group text-sm">
                          <span>{{ child.name }}</span>
                          <ArrowRightOutlined class="text-xs opacity-0 group-hover:opacity-100 duration-200 shrink-0 text-primary" />
                        </RouterLink>
                      </li>
                    </ul>
                  </li>
                  <!-- Parent without children: single link -->
                  <li v-else>
                    <RouterLink :to="{ name: 'categoryView', params: { name: parent.name } }"
                      class="flex items-center justify-between p-2 rounded-lg text-stone-600 hover:bg-stone-50 duration-200 ease-out group">
                      <span>{{ parent.name }}</span>
                      <ArrowRightOutlined class="text-xs opacity-0 group-hover:opacity-100 duration-200 text-primary" />
                    </RouterLink>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <!-- Full Width Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10 sm:mb-16">

        <!-- Latest News (Left 2 cols) -->
        <section class="lg:col-span-2 px-2 py-3 sm:px-4 sm:py-4">
          <div class="flex items-center justify-between mb-4 sm:mb-6 px-1 sm:px-2 gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <span class="h-8 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <h2 class="text-2xl font-bold text-stone-800 tracking-tight m-0">សន្តសន្តី</h2>
            </div>
            <RouterLink :to="{ name: 'saintList' }"
              class="text-primary hover:text-primary-hover font-medium flex items-center text-sm shrink-0">
              មើលបន្ថែម
              <ArrowRightOutlined class="ml-1 text-xs" />
            </RouterLink>
          </div>
          <div class="bg-surface-elevated p-4 sm:p-6 rounded-2xl shadow-sm ring-1 ring-black/5">
            <Saint />
          </div>
        </section>
      </div>


      <div class="space-y-10 sm:space-y-16">

        <!-- Bible & Sermon Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          <section class="px-2 py-3 sm:px-4 sm:py-4">
            <div class="flex items-center justify-between mb-4 sm:mb-6 px-1 sm:px-2 gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <span class="h-8 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <h2 class="text-2xl font-bold text-stone-800 tracking-tight m-0">អត្ថបទព្រះគម្ពីរប្រចាំថ្ងៃ</h2>
              </div>
              <RouterLink :to="{ name: 'dailyBibleList' }"
                class="text-primary hover:text-primary-hover font-medium flex items-center text-sm shrink-0">
                មើលបន្ថែម
                <ArrowRightOutlined class="ml-1 text-xs" />
              </RouterLink>
            </div>
            <div class="bg-surface-elevated p-4 sm:p-6 rounded-2xl shadow-sm ring-1 ring-black/5">
              <DailyBible :showControls="false" />
            </div>
          </section>

          <section class="px-2 py-3 sm:px-4 sm:py-4">
            <div class="flex items-center justify-between mb-4 sm:mb-6 px-1 sm:px-2 gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <span class="h-8 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <h2 class="text-2xl font-bold text-stone-800 tracking-tight m-0">ធម្មទេសនា​ប្រចាំថ្ងៃ</h2>
              </div>
              <RouterLink :to="{ name: 'dailySermonList' }"
                class="text-primary hover:text-primary-hover font-medium flex items-center text-sm shrink-0">
                មើលបន្ថែម
                <ArrowRightOutlined class="ml-1 text-xs" />
              </RouterLink>
            </div>
            <div class="bg-surface-elevated p-4 sm:p-6 rounded-2xl shadow-sm ring-1 ring-black/5">
              <DailySermon />
            </div>
          </section>
        </div>

        <!-- The Messenger -->
        <section class="px-2 py-3 sm:px-4 sm:py-4">
          <div class="flex items-center justify-between mb-5 sm:mb-8 px-1 sm:px-2 gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <span class="h-8 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <h2 class="text-2xl font-bold text-stone-800 tracking-tight m-0">The Messenger</h2>
            </div>
            <RouterLink
              :to="{ name: 'messengerList' }"
              class="text-primary hover:text-primary-hover font-medium flex items-center text-sm shrink-0"
            >
              មើលបន្ថែម
              <ArrowRightOutlined class="ml-1 text-xs" />
            </RouterLink>
          </div>
          <div class="bg-surface-elevated p-4 sm:p-6 rounded-2xl shadow-sm ring-1 ring-black/5">
            <MessengerListingPage embed />
          </div>
        </section>

        <!-- Gallery -->
        <section class="px-2 py-3 sm:px-4 sm:py-4">
          <div class="flex items-center justify-between mb-5 sm:mb-8 px-1 sm:px-2 gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <span class="h-8 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <h2 class="text-2xl font-bold text-stone-800 tracking-tight m-0">កម្រងរូបភាព</h2>
            </div>
            <RouterLink :to="{ name: 'galleryGridView' }"
              class="text-primary hover:text-primary-hover font-medium flex items-center text-sm shrink-0">
              មើលបន្ថែម
              <ArrowRightOutlined class="ml-1 text-xs" />
            </RouterLink>
          </div>
          <div class="bg-surface-elevated p-4 sm:p-6 rounded-2xl shadow-sm ring-1 ring-black/5">
            <GalleryGridViewPage :showControls="false" />
          </div>
        </section>

      </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.home-hero-carousel :deep(.slick-dots) {
  margin-inline: 0;
  padding-bottom: 0.75rem;
}
.home-hero-carousel :deep(.slick-dots li button) {
  background: rgba(255, 255, 255, 0.4) !important;
  opacity: 1;
}
.home-hero-carousel :deep(.slick-dots li.slick-active button) {
  background: #fff !important;
}
</style>
