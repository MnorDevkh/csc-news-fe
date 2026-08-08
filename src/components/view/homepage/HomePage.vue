<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { NewsService } from '../../../services/NewsService';
import { useSiteLanguage } from '@/composables/useSiteLanguage';
import { localizedArticleRoute } from '@/utils/articleRoutes';
import { ReadOutlined, PictureOutlined, TeamOutlined, FireOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';
import Saint from './Saint.vue';
import GalleryGridViewPage from './GalleryGridViewPage.vue';
import DailyBible from './DailyBible.vue';
import DailySermon from './DailySermon.vue';
import MessengerListingPage from '../messenger/MessengerListingPage.vue';
import SermonIssueListingPage from '../sermon-issue/SermonIssueListingPage.vue';

const featuredArticles = ref([]);
const latestHeadlines = ref([]);
const newsCategories = ref([]);
const isLoading = ref(true);
const hasError = ref(false);
const currentFeaturedIndex = ref(0);

const router = useRouter();
const { t } = useI18n();
const { lang } = useSiteLanguage();

async function loadHomepageData() {
  isLoading.value = true;
  hasError.value = false;
  try {
    const [articles, headlines, categories] = await Promise.all([
      NewsService.getFeaturedArticles(lang.value),
      NewsService.getLatestHeadlines(lang.value),
      NewsService.getNewsCategories(lang.value)
    ]);
    featuredArticles.value = articles;
    latestHeadlines.value = (Array.isArray(headlines) ? headlines : []).filter(
      (h) => h && h.id !== null && h.id !== undefined
    );
    newsCategories.value = categories;
    currentFeaturedIndex.value = 0;
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadHomepageData);
watch(lang, loadHomepageData);

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

const featureCards = [
  {
    to: '/news',
    icon: TeamOutlined,
    title: 'ពត៍មានព្រះសហគមន៍',
    text: 'ពត៍មានភូមិភាគ និងសកម្មភាពផ្សេងៗក្នុងព្រះសហគមន៍កាតូលិក។',
  },
  {
    to: '/read',
    icon: ReadOutlined,
    title: 'ព្រះគម្ពីរ',
    text: 'អត្ថបទ និងការសិក្សាព្រះគម្ពីរសម្រាប់ការអានប្រចាំថ្ងៃ។',
  },
  {
    to: { name: 'saintList' },
    icon: FireOutlined,
    title: 'សន្តសន្តី',
    text: 'ប្រវត្តិ និងគំរូជីវិតសន្តបុគ្គលដែលបំភ្លឺផ្លូវជំនឿ។',
  },
  {
    to: { name: 'galleryGridView' },
    icon: PictureOutlined,
    title: 'កម្រងរូបភាព',
    text: 'រូបភាពសកម្មភាព និងពិធីបុណ្យក្នុងព្រះសហគមន៍។',
  },
  {
    to: { name: 'messengerList' },
    icon: ReadOutlined,
    title: 'The Messenger',
    text: 'ទស្សនាវដ្ដីឌីជីថលក្នុងទម្រង់ flipbook សម្រាប់ការអាន។',
  },
  {
    to: { name: 'sermonIssueList' },
    icon: ReadOutlined,
    title: 'The Sermon',
    text: 'ធម្មទេសនា និងទស្សនាវដ្ដីសម្រាប់ការសញ្ជឹងគិត។',
  },
];
</script>
<template>
  <div class="homepage min-h-screen pb-10 sm:pb-14 flex flex-col items-center bg-transparent">
    <main class="container-site w-full mx-auto">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="py-6 sm:py-8 space-y-8 animate-pulse">
        <div class="overflow-hidden bg-cream-dark h-[420px] sm:h-[520px]" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <div v-for="n in 3" :key="n" class="panel p-6">
            <div class="h-5 w-5 bg-cream-dark mb-4" />
            <div class="h-6 bg-cream-dark w-2/3 mb-3" />
            <div class="h-4 bg-cream-dark w-full" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="py-16 flex flex-col items-center justify-center text-center">
        <div class="panel p-6 sm:p-10 max-w-md w-full">
          <div class="h-14 w-14 border border-danger/30 text-danger flex items-center justify-center mx-auto mb-5 text-2xl">!</div>
          <h3 class="font-display text-xl text-navy mb-2">Something went wrong</h3>
          <p class="text-ink-soft text-sm mb-6">Failed to load homepage content. Please check your connection and try again.</p>
          <button @click="() => { hasError = false; isLoading = true; location.reload(); }"
            class="px-6 py-2.5 bg-navy text-cream text-sm font-semibold hover:bg-primary-hover transition-all">
            Try Again
          </button>
        </div>
      </div>
      <template v-else>

      <!-- Hero Section -->
      <section class="pt-3 sm:pt-5 animate-fade-up">
        <a-carousel autoplay class="home-hero-carousel overflow-hidden border border-line shadow-soft">
          <div v-for="article in latestHeadlines.slice(0, 5)" :key="article.id"
            class="relative h-[420px] sm:h-[500px] md:h-[560px] w-full cursor-pointer"
            @click="router.push(localizedArticleRoute(article, lang))">
            <img :src="article.thumbnail" :alt="article.title" class="h-full w-full object-cover" />
            <div
              class="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy/55 to-transparent flex flex-col justify-end p-5 sm:p-8 md:p-12">
              <div class="flex items-center gap-3 mb-3 flex-wrap">
                <span v-if="article.category?.name"
                  class="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold tracking-wide bg-gold text-navy-deep">
                  {{ article.category.name }}
                </span>
                <span v-if="article.publish_at" class="text-cream/70 text-sm">
                  {{ formatDate(article.publish_at) }}
                </span>
                <span v-if="article.reading_time" class="text-cream/70 text-sm">
                  · {{ article.reading_time }} min read
                </span>
              </div>
              <h3 class="font-display text-2xl md:text-4xl font-semibold text-cream mb-2 tracking-tight text-balance">{{ article.title }}</h3>
              <p class="text-cream/80 text-base sm:text-lg line-clamp-2 max-w-3xl">{{ article.excerpt }}</p>
            </div>
          </div>
        </a-carousel>
      </section>

      <!-- Feature Cards — archive menu style -->
      <section class="border-y border-line bg-surface-soft mt-8 sm:mt-12 -mx-3 sm:-mx-5 md:-mx-6 lg:-mx-8 xl:-mx-10 px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-10 sm:py-14 animate-fade-up-delay">
        <div class="mx-auto max-w-2xl text-center mb-8 sm:mb-10">
          <h2 class="font-display text-3xl text-navy sm:text-4xl m-0">ស្វែងយល់បណ្ណសារ</h2>
          <div class="gold-rule mx-auto mt-4"></div>
          <p class="mt-4 text-base text-ink-soft sm:text-lg m-0">
            ពីព័ត៌មានទៅព្រះគម្ពីរ ពីសន្តសន្តីទៅបណ្ដុំឌីជីថល — តាមល្បឿនផ្ទាល់ខ្លួនរបស់អ្នក។
          </p>
        </div>
        <ul class="grid list-none p-0 m-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <li v-for="(card, idx) in featureCards" :key="idx">
            <RouterLink :to="card.to" class="archive-card group">
              <component :is="card.icon" class="archive-card__icon text-xl" />
              <h3 class="archive-card__title">{{ card.title }}</h3>
              <p class="archive-card__text">{{ card.text }}</p>
              <span class="archive-card__cta">
                បើក
                <ArrowRightOutlined class="archive-card__cta-icon text-xs" />
              </span>
            </RouterLink>
          </li>
        </ul>
      </section>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-10 sm:mt-14 mb-10 sm:mb-16">

        <!-- Latest News (Left 2 cols) -->
        <section class="lg:col-span-2">
          <div class="flex items-center justify-between mb-5 gap-3">
            <div class="min-w-0">
              <h2 class="section-heading">{{ t('home.latestNews') }}</h2>
              <div class="gold-rule-left mt-3"></div>
            </div>
            <RouterLink to="/news" class="section-link shrink-0">
              មើលទាំងអស់
              <ArrowRightOutlined class="text-xs" />
            </RouterLink>
          </div>

          <div class="panel overflow-hidden">
            <div v-if="latestHeadlines.length === 0" class="p-6 text-center text-muted text-sm">
              No latest news available.
            </div>
            <ul v-else class="divide-y divide-line list-none p-0 m-0">
              <li v-for="headline in latestHeadlines" :key="headline.id" class="group">
                <RouterLink :to="localizedArticleRoute(headline, lang)"
                  class="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 hover:bg-surface-soft duration-200 no-underline">
                  <div class="w-28 h-[76px] flex-shrink-0 overflow-hidden bg-cream-dark border border-line">
                    <img v-if="headline.thumbnail" :src="headline.thumbnail" :alt="headline.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div v-else class="w-full h-full bg-gradient-to-br from-navy/10 to-gold/10" />
                  </div>
                  <div class="flex-1 min-w-0 flex flex-col justify-center">
                    <h4
                      class="text-base font-semibold text-navy group-hover:text-burgundy duration-200 leading-snug line-clamp-2 mb-1.5 m-0">
                      {{ headline.title }}</h4>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span v-if="headline.category?.name"
                        class="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold bg-primary-light text-primary">
                        {{ headline.category.name }}
                      </span>
                      <span class="text-xs text-muted">{{ formatDate(headline.publish_at) }}</span>
                      <span v-if="headline.reading_time" class="text-xs text-muted">· {{ headline.reading_time }} min</span>
                    </div>
                  </div>
                </RouterLink>
              </li>
            </ul>
          </div>
        </section>

        <!-- Sidebar -->
        <aside class="lg:col-span-1">
          <div class="sticky top-24">
            <div class="panel p-5 sm:p-6">
              <h2 class="font-display text-lg text-navy mb-1 m-0">មាតិការ</h2>
              <div class="gold-rule-left mt-2 mb-4"></div>
              <div v-if="hierarchicalCategories.length === 0" class="text-muted text-sm">
                No categories available.
              </div>
              <ul v-else class="space-y-1 list-none p-0 m-0">
                <template v-for="({ parent, children }) in hierarchicalCategories" :key="parent.id">
                  <li v-if="children.length > 0" class="pt-2 first:pt-0">
                    <div class="text-sm font-semibold text-navy px-2 py-1.5">{{ parent.name }}</div>
                    <ul class="ml-2 mt-0.5 space-y-0.5 border-l border-line pl-2 list-none p-0">
                      <li v-for="child in children" :key="child.id">
                        <RouterLink :to="{ name: 'categoryView', params: { name: child.slug } }"
                          class="flex items-center justify-between py-1.5 px-2 text-ink-soft hover:bg-cream hover:text-burgundy duration-200 group text-sm no-underline">
                          <span>{{ child.name }}</span>
                          <ArrowRightOutlined class="text-xs opacity-0 group-hover:opacity-100 duration-200 shrink-0 text-gold" />
                        </RouterLink>
                      </li>
                    </ul>
                  </li>
                  <li v-else>
                    <RouterLink :to="{ name: 'categoryView', params: { name: parent.slug } }"
                      class="flex items-center justify-between p-2 text-ink-soft hover:bg-cream hover:text-burgundy duration-200 group no-underline text-sm">
                      <span>{{ parent.name }}</span>
                      <ArrowRightOutlined class="text-xs opacity-0 group-hover:opacity-100 duration-200 text-gold" />
                    </RouterLink>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <!-- Saints -->
      <section class="mb-10 sm:mb-16">
        <div class="flex items-center justify-between mb-5 gap-3">
          <div class="min-w-0">
            <h2 class="section-heading">សន្តសន្តី</h2>
            <div class="gold-rule-left mt-3"></div>
          </div>
          <RouterLink :to="{ name: 'saintList' }" class="section-link shrink-0">
            មើលបន្ថែម
            <ArrowRightOutlined class="text-xs" />
          </RouterLink>
        </div>
        <div class="panel p-4 sm:p-6">
          <Saint />
        </div>
      </section>

      <div class="space-y-10 sm:space-y-14">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <section>
            <div class="flex items-center justify-between mb-5 gap-3">
              <div class="min-w-0">
                <h2 class="section-heading">អត្ថបទព្រះគម្ពីរប្រចាំថ្ងៃ</h2>
                <div class="gold-rule-left mt-3"></div>
              </div>
              <RouterLink :to="{ name: 'dailyBibleList' }" class="section-link shrink-0">
                មើលបន្ថែម
                <ArrowRightOutlined class="text-xs" />
              </RouterLink>
            </div>
            <div class="panel p-4 sm:p-6">
              <DailyBible :showControls="false" />
            </div>
          </section>

          <section>
            <div class="flex items-center justify-between mb-5 gap-3">
              <div class="min-w-0">
                <h2 class="section-heading">ធម្មទេសនា​ប្រចាំថ្ងៃ</h2>
                <div class="gold-rule-left mt-3"></div>
              </div>
              <RouterLink :to="{ name: 'dailySermonList' }" class="section-link shrink-0">
                មើលបន្ថែម
                <ArrowRightOutlined class="text-xs" />
              </RouterLink>
            </div>
            <div class="panel p-4 sm:p-6">
              <DailySermon />
            </div>
          </section>
        </div>

        <section>
          <div class="flex items-center justify-between mb-5 gap-3">
            <div class="min-w-0">
              <h2 class="section-heading">The Messenger</h2>
              <div class="gold-rule-left mt-3"></div>
            </div>
            <RouterLink :to="{ name: 'messengerList' }" class="section-link shrink-0">
              មើលបន្ថែម
              <ArrowRightOutlined class="text-xs" />
            </RouterLink>
          </div>
          <div class="panel p-4 sm:p-6">
            <MessengerListingPage embed />
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-5 gap-3">
            <div class="min-w-0">
              <h2 class="section-heading">The Sermon</h2>
              <div class="gold-rule-left mt-3"></div>
            </div>
            <RouterLink :to="{ name: 'sermonIssueList' }" class="section-link shrink-0">
              មើលបន្ថែម
              <ArrowRightOutlined class="text-xs" />
            </RouterLink>
          </div>
          <div class="panel p-4 sm:p-6">
            <SermonIssueListingPage embed />
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-5 gap-3">
            <div class="min-w-0">
              <h2 class="section-heading">កម្រងរូបភាព</h2>
              <div class="gold-rule-left mt-3"></div>
            </div>
            <RouterLink :to="{ name: 'galleryGridView' }" class="section-link shrink-0">
              មើលបន្ថែម
              <ArrowRightOutlined class="text-xs" />
            </RouterLink>
          </div>
          <div class="panel p-4 sm:p-6">
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
  background: rgba(255, 255, 255, 0.35) !important;
  opacity: 1;
  border-radius: 4px;
  height: 3px !important;
}
.home-hero-carousel :deep(.slick-dots li.slick-active button) {
  background: #b8954a !important;
  width: 24px !important;
}
</style>
