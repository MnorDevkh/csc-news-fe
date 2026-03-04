<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BibleService } from '../../../services/BibleService';
import ChapterService from '../../../services/ChapterService';
import VerseService from '../../../services/VerseService';
import SectionService from '../../../services/SectionService';

const route = useRoute();
const router = useRouter();
const item = ref(null);
const loading = ref(false);
/** @type {import('vue').Ref<Record<string, { verse_number: number; verse_text: string }[]>> */
const chapterVerses = ref({});
/** @type {import('vue').Ref<Record<string, { id: string; title?: string; start_verse: number; end_verse: number; order_no: number }[]>> */
const chapterSections = ref({});

const fetchVersesForChapter = async (chapterId) => {
  try {
    const res = await VerseService.getVerses({
      chapter_id: chapterId,
      skip: 0,
      limit: 500,
      order_by: 'verse_number',
    });
    const items = res.data?.items || [];
    chapterVerses.value[chapterId] = items.map((v) => ({
      verse_number: v.verse_number,
      verse_text: v.verse_text,
    }));
  } catch (e) {
    console.error('Failed to fetch verses for chapter:', chapterId, e);
    chapterVerses.value[chapterId] = [];
  }
};

const fetchSectionsForChapter = async (chapterId) => {
  try {
    const res = await SectionService.getSectionsByChapter(chapterId, {
      skip: 0,
      limit: 100,
      order_by: 'order_no',
    });
    const items = res.data?.items || [];
    chapterSections.value[chapterId] = items;
  } catch (e) {
    console.error('Failed to fetch sections for chapter:', chapterId, e);
    chapterSections.value[chapterId] = [];
  }
};

const fetchChapters = async (bibleId, language) => {
  try {
    const chaptersResponse = await ChapterService.getChaptersByBible(bibleId, {
      skip: 0,
      limit: 500,
      language,
      order_by: 'chapter_number',
    });
    if (chaptersResponse.data && item.value) {
      item.value.chapters = chaptersResponse.data.items || [];
      for (const ch of item.value.chapters) {
        await fetchVersesForChapter(ch.id);
        await fetchSectionsForChapter(ch.id);
      }
    }
  } catch (error) {
    console.error('Failed to fetch chapters:', error);
    if (item.value) item.value.chapters = [];
  }
};

const fetchData = async () => {
  loading.value = true;
  chapterVerses.value = {};
  chapterSections.value = {};
  try {
    const id = route.params.bibleId;
    if (id) {
      const data = await BibleService.getBibleDetails(id);
      if (data) {
        item.value = data;
        await fetchChapters(id, item.value.language);
      }
    }
  } catch (error) {
    console.error('Failed to fetch bible details:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const getVerses = (chapterId) => {
  return chapterVerses.value[chapterId] || [];
};

/** Sections that start at this verse number (show title above this verse) */
const getSectionsForVerse = (chapterId, verseNumber) => {
  const sections = chapterSections.value[chapterId] || [];
  return sections.filter((s) => s.start_verse === verseNumber);
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-12 font-sans flex flex-col items-center">
    <main class="w-full max-w-[1400px] px-4 mx-auto py-8">
      <div class="mb-6">
        <button
          @click="router.back()"
          class="group inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <svg
            class="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          ត្រឡប់ទៅបញ្ជីសៀវភៅ
        </button>
      </div>

      <h1 v-if="item" class="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-800 mb-6 border-l-4 border-indigo-500 pl-4">
        {{ item.name }}
      </h1>

      <div v-if="loading" class="flex justify-center py-16">
        <div class="h-9 w-9 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>

      <div v-else-if="!item" class="text-center py-16">
        <p class="text-gray-500 text-sm">No Bible found.</p>
      </div>

      <div v-else class="space-y-8">
        <section
          v-for="chapter in (item.chapters || [])"
          :key="chapter.id"
          class="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 class="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-0 pl-4">
            ជំពូក {{ chapter.chapter_number }}
          </h2>
          <div
            class="leading-relaxed text-gray-800 verse-list"
            :style="{ fontSize: 'calc(1rem * var(--bible-font-scale, 1.05))' }"
          >
            <template v-for="verse in getVerses(chapter.id)" :key="verse.verse_number">
              <div
                v-for="section in getSectionsForVerse(chapter.id, verse.verse_number)"
                :key="section.id"
                class="mt-5 mb-2 text-sm font-semibold text-amber-700 first:mt-0"
              >
                {{ section.title }}
              </div>
              <span class="mr-1">
                <span class="text-[11px] font-bold text-amber-600 align-top mr-0.5">{{ verse.verse_number }}</span>
                <span class="verse-content" v-html="verse.verse_text" />
              </span>
            </template>
          </div>
          <p v-if="getVerses(chapter.id).length === 0" class="text-sm text-gray-500">
            មិនទាន់មានខណ្ឌ។
          </p>
        </section>

        <p v-if="!item.chapters?.length" class="py-8 text-center text-sm text-gray-500">
          មិនទាន់មានជំពូកសម្រាប់សៀវភៅនេះទេ។
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.verse-content :deep(p) {
  display: inline;
  margin: 0;
}
</style>