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

function normalizeLanguageCode(raw) {
  if (!raw) return undefined;
  const s = String(raw).trim().toLowerCase();
  const first = s.split(',')[0]?.trim();
  return first || undefined;
}

const fetchVerses = async (chapterId) => {
  try {
    const versesResponse = await VerseService.getVerses({
      chapter_id: chapterId,
      skip: (versesPagination.value.current - 1) * versesPagination.value.pageSize,
      limit: versesPagination.value.pageSize,
      language: normalizeLanguageCode(chapter.value?.bible?.language),
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
    const id = route.params.id || route.params.chapterId;
    if (id) {
      const response = await ChapterService.getChapter(id);
      console.log("chapter",response.data);
      if (response.data) {
        chapter.value = response.data;

        if (chapter.value.bible_id) {
          const chaptersResponse = await ChapterService.getChaptersByBible(chapter.value.bible_id, {
            skip: 0,
            limit: 100,
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
  <div class="min-h-[calc(100vh-3.5rem-3.5rem)] py-4 sm:py-8">
    <div class="mx-auto max-w-5xl px-0 sm:px-0 lg:px-8">
      <!-- Navigation -->
      <div class="mb-8">
        <button
          @click="goBack"
          class="group inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
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
      <div v-else class="bg-white overflow-hidden shadow-sm rounded-2xl border border-amber-100">
        <div class="p-4 sm:p-8">
          <div class="border-b border-amber-100 pb-4 mb-5">
            <h1 class="text-2xl sm:text-3xl font-bold leading-tight text-slate-900">
              {{ bookAndChapterLabel || `Chapter ${chapter.chapter_number}` }}
            </h1>
            <p v-if="chapter.bible?.name" class="mt-1 text-sm text-blue-700 font-medium">
              {{ chapter.bible.name }}
            </p>
          </div>

          <!-- Verses Section -->
          <div class="mt-4 border-t border-amber-100 pt-5">
            <h3 class="text-base font-semibold text-slate-900 mb-3">
              ខណ្ឌក្នុង {{ bookAndChapterLabel || `Chapter ${chapter.chapter_number}` }}
            </h3>

            <div
              v-if="verses && verses.length > 0"
              class="leading-relaxed text-slate-900"
              :style="{ fontSize: 'calc(1rem * var(--bible-font-scale, 1.05))' }"
            >
              <template v-for="(verse, vIdx) in verses" :key="verse.id">
                <div
                  v-for="section in (chapter.sections || []).filter(s => s.start_verse === verse.verse_number)"
                  :key="section.id"
                  class="mt-4 mb-2 text-sm font-semibold text-amber-800"
                >
                  {{ section.title }}
                </div>
                <div class="inline-block mb-1 mr-1">
                  <span class="text-[11px] font-bold text-amber-700 align-top mr-0.5">
                    {{ verse.verse_number }}
                  </span>
                  <span class="verse-content" v-html="verse.verse_text" />
                </div>
              </template>
            </div>

            <div v-else class="text-sm text-slate-500 mt-2">
              មិនទាន់មានខណ្ឌសម្រាប់ជំពូកនេះទេ។
            </div>

            <div v-if="versesPagination.total > versesPagination.pageSize" class="pt-6 flex justify-center">
              <APagination
                v-model:current="versesPagination.current"
                :page-size="versesPagination.pageSize"
                :total="versesPagination.total"
                @change="onVersesPageChange"
                show-less-items
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.verse-content p {
  display: inline;
  margin: 0;
}
</style>