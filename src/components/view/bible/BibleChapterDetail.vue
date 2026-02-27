<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Pagination as APagination } from 'ant-design-vue';
import ChapterService from '../../../services/ChapterService';
import VerseService from '../../../services/VerseService';

const route = useRoute();
const router = useRouter();
const chapter = ref(null);
const chapters = ref([]);
const verses = ref([]);
const versesPagination = ref({
  current: 1,
  pageSize: 100,
  total: 0,
});
const loading = ref(false);

const fetchVerses = async (chapterId) => {
  try {
    const versesResponse = await VerseService.getVerses({
      chapter_id: chapterId,
      skip: (versesPagination.value.current - 1) * versesPagination.value.pageSize,
      limit: versesPagination.value.pageSize,
      order_by: 'verse_number',
    });
    if (versesResponse.data) {
      verses.value = versesResponse.data.items || [];
      versesPagination.value.total = versesResponse.data.total_elements || 0;
    }
  } catch (error) {
    console.error('Failed to fetch verses:', error);
  }
};

const fetchData = async () => {
  loading.value = true;

  try {
    const id = route.params.id;
    if (id) {
      const response = await ChapterService.getChapter(id);
      if (response.data) {
        chapter.value = response.data;

        if (chapter.value.bible_id) {
          const chaptersResponse = await ChapterService.getChaptersByBible(chapter.value.bible_id, {
            skip: 0,
            limit: 100,
            language: chapter.value.language,
            order_by: 'chapter_number',
          });
          if (chaptersResponse.data) {
            chapters.value = chaptersResponse.data.items || [];
          }
        }

        versesPagination.value.current = 1;
        await fetchVerses(id);
      }
    }
  } catch (error) {
    console.error('Failed to fetch chapter details:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) fetchData();
  }
);

const onVersesPageChange = (page, pageSize) => {
  versesPagination.value.current = page;
  versesPagination.value.pageSize = pageSize;
  if (chapter.value) {
    fetchVerses(chapter.value.id);
  }
};

const goBack = () => {
  if (chapter.value && chapter.value.bible_id) {
    router.push({ name: 'bible-detail', params: { id: chapter.value.bible_id } });
  } else {
    router.back();
  }
};

const bookAndChapterLabel = computed(() => {
  const bookName = chapter.value?.book_name || chapter.value?.bible?.name || '';
  const chapterNumber = chapter.value?.chapter_number;
  if (!bookName && !chapterNumber) return '';
  if (!bookName) return `Chapter ${chapterNumber}`;
  if (!chapterNumber) return bookName;
  return `${bookName} ${chapterNumber}`;
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Navigation -->
      <div class="mb-8">
        <button
          @click="goBack"
          class="group flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          <svg
            class="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span v-if="chapter?.bible?.name">ត្រឡប់ទៅ {{ chapter.bible.name }}</span>
          <span v-else>ត្រឡប់</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!chapter" class="text-center py-20">
        <p class="text-gray-500 text-lg">Chapter not found.</p>
      </div>

      <!-- Chapter Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1 order-2 lg:order-1">
          <div class="bg-white overflow-hidden shadow-sm rounded-lg p-6 sticky top-6">
            <h3 class="text-lg font-medium text-gray-900 mb-1">
              Chapters
            </h3>
            <p v-if="chapter.book_name" class="text-xs text-gray-500 mb-4">
              {{ chapter.book_name }}
            </p>
            <div class="grid grid-cols-5 lg:grid-cols-4 gap-2">
              <button
                v-for="c in chapters"
                :key="c.id"
                @click="router.push({ name: 'chapter-detail', params: { id: c.id } })"
                :class="[
                  'p-2 text-center text-sm rounded-md transition-colors',
                  c.id === chapter.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
                ]"
              >
                {{ c.chapter_number }}
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3 order-1 lg:order-2 bg-white overflow-hidden shadow-sm rounded-lg">
          <div class="p-8">
            <div class="border-b border-gray-200 pb-5 mb-6">
              <h1 class="text-3xl font-bold leading-tight text-gray-900">
                {{ bookAndChapterLabel || (chapter.title && chapter.title !== 'string'
                  ? chapter.title
                  : `Chapter ${chapter.chapter_number}`) }}
              </h1>
              <p v-if="chapter.bible?.name" class="mt-2 text-sm text-blue-600 font-medium">
                {{ chapter.bible.name }}
              </p>
            </div>

            <div v-if="chapter.summary && chapter.summary !== 'string'" class="prose prose-blue max-w-none text-gray-700">
              <p class="text-lg leading-relaxed whitespace-pre-line">{{ chapter.summary }}</p>
            </div>

            <!-- Verses Section -->
            <div v-if="verses && verses.length > 0" class="mt-10 border-t border-gray-100 pt-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">
                ខណ្ឌក្នុង {{ bookAndChapterLabel || `Chapter ${chapter.chapter_number}` }}
              </h3>
              <div class="text-lg leading-relaxed text-gray-700">
                <span v-for="verse in verses" :key="verse.id">
                  <span class="text-xs font-bold text-red-600 align-top mr-0.5">{{ verse.verse_number }}</span>
                  <span class="mr-1">{{ verse.content }}</span>
                </span>
              </div>
              <div v-if="versesPagination.total > 0" class="pt-8 flex justify-center">
                <APagination
                  v-model:current="versesPagination.current"
                  :page-size="versesPagination.pageSize"
                  :total="versesPagination.total"
                  @change="onVersesPageChange"
                  show-less-items
                />
              </div>
            </div>

            <!-- Media Links -->
            <div
              v-if="(chapter.audio_url && chapter.audio_url !== 'string') || (chapter.video_url && chapter.video_url !== 'string')"
              class="mt-10 border-t border-gray-100 pt-6"
            >
              <h3 class="text-lg font-medium text-gray-900 mb-4">មូលធនមេឌៀ</h3>
              <div class="flex flex-col sm:flex-row gap-4">
                <a
                  v-if="chapter.audio_url && chapter.audio_url !== 'string'"
                  :href="chapter.audio_url"
                  target="_blank"
                  class="inline-flex justify-center items-center rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586ল4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                  ស្តាប់អូឌីយ៉ូ
                </a>
                <a
                  v-if="chapter.video_url && chapter.video_url !== 'string'"
                  :href="chapter.video_url"
                  target="_blank"
                  class="inline-flex justify-center items-center rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    /><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  មើលវីដេអូ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>