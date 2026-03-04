<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <router-link :to="{ name: 'adminBibleManagement' }" class="hover:text-blue-600">Bible Management</router-link>
      <span>/</span>
      <router-link
        v-if="bibleId"
        :to="{ name: 'adminChapterList', query: { bible: bibleId } }"
        class="hover:text-blue-600"
      >
        {{ bibleName || 'Bible' }}
      </router-link>
      <span v-if="bibleId">/</span>
      <span class="text-gray-800 font-medium">{{ chapterTitle || 'Verses' }}</span>
    </nav>

    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Verses</h2>
        <p class="text-gray-500 text-sm">Manage verses for this chapter</p>
      </div>
      <div class="flex gap-2">
        <button
          v-if="bibleId"
          @click="router.push({ name: 'adminChapterList', query: { bible: bibleId } })"
          class="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Back to Chapters
        </button>
        <button
          @click="goToCreateVerse"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <PlusOutlined />
          <span>Create Verse</span>
        </button>
      </div>
    </div>

    <!-- Filters & Pagination Controls -->
    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <div class="flex flex-wrap gap-4 flex-1">
        <div class="flex flex-col">
          <label class="text-xs font-medium text-gray-500 mb-1">Language</label>
          <select
            v-model="filters.language"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
          >
            <option value="">All</option>
            <option value="km">Khmer (km)</option>
            <option value="en">English (en)</option>
          </select>
        </div>
        <div class="flex flex-col">
          <label class="text-xs font-medium text-gray-500 mb-1">Order By</label>
          <input
            v-model="filters.order_by"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
          >
        </div>
        <div class="flex flex-col">
          <label class="text-xs font-medium text-gray-500 mb-1">Page Size</label>
          <select
            v-model.number="pageSize"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          @click="applyFilters"
          class="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Apply
        </button>
        <button
          @click="resetFilters"
          class="px-4 py-2 rounded-lg border border-transparent text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verse text</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">Loading verses...</td>
          </tr>
          <tr v-else-if="!verses.length">
            <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">No verses found.</td>
          </tr>
          <tr v-for="v in verses" :key="v.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ v.verse_number }}</td>
            <td class="px-6 py-4 text-sm text-gray-700 max-w-md truncate" :title="v.verse_text">{{ v.verse_text || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  @click="router.push({ name: 'adminVerseEdit', params: { chapterId, verseId: v.id } })"
                  class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                >
                  <EditOutlined />
                </button>
                <button @click="deleteVerse(v.id)" class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                  <DeleteOutlined />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="totalPages > 1"
      class="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-600"
    >
      <div>
        Showing
        <span class="font-medium">{{ pageStart }}</span>
        -
        <span class="font-medium">{{ pageEnd }}</span>
        of
        <span class="font-medium">{{ totalElements }}</span>
        verses
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="goToPrevPage"
          :disabled="pageIndex <= 1"
          class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        <span>
          Page
          <span class="font-medium">{{ pageIndex }}</span>
          of
          <span class="font-medium">{{ totalPages }}</span>
        </span>
        <button
          @click="goToNextPage"
          :disabled="pageIndex >= totalPages"
          class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { BibleService } from '@/services/BibleService';
import ChapterService from '@/services/ChapterService';
import VerseService from '@/services/VerseService';
import { useBibleManagementContext } from '@/composables/useBibleManagementContext';

const route = useRoute();
const router = useRouter();
const { setLastChapterId, setLastBibleId } = useBibleManagementContext();

const chapterId = ref(route.params.chapterId);
const bibleId = ref(null);
const bibleName = ref('');
const chapterTitle = ref('');
const verses = ref([]);
const loading = ref(false);
const filters = ref({
  language: 'km',
  order_by: 'verse_number',
});
const pageIndex = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const totalElements = ref(0);

async function loadChapter() {
  if (!chapterId.value) return;
  try {
    const res = await ChapterService.getChapter(chapterId.value);
    const ch = res.data;
    chapterTitle.value = `Chapter ${ch.chapter_number}`;
    bibleId.value = ch.bible_id;
    if (ch.bible_id) {
      try {
        const bibleRes = await BibleService.getBible(ch.bible_id);
        const bibleData = bibleRes.data;
        bibleName.value = bibleData?.name || 'Bible';
        if (bibleData?.language && !filters.value.language) {
          filters.value.language = bibleData.language;
        }
      } catch {
        bibleName.value = 'Bible';
      }
    }
  } catch {
    chapterTitle.value = 'Chapter';
  }
  syncContext();
}

async function loadVerses() {
  loading.value = true;
  try {
    const page = pageIndex.value || 1;
    const size = pageSize.value || 100;

    const res = await VerseService.getVerses({
      chapter_id: chapterId.value || undefined,
      skip: (page - 1) * size,
      limit: size,
      language: filters.value.language || undefined,
      order_by: filters.value.order_by || 'verse_number',
    });
    const data = res.data;
    const items = data?.items ?? (Array.isArray(data) ? data : []);
    verses.value = items;

    if (data && typeof data.total_elements === 'number') {
      totalElements.value = data.total_elements;
      totalPages.value = data.total_pages || 1;
      pageIndex.value = data.page_index || page;
      pageSize.value = data.page_size || size;
    } else {
      totalElements.value = items.length;
      totalPages.value = 1;
      pageIndex.value = 1;
    }
  } catch (err) {
    console.error('Failed to load verses', err);
    verses.value = [];
  } finally {
    loading.value = false;
  }
}

function applyFilters() {
  pageIndex.value = 1;
  loadVerses();
}

function resetFilters() {
  filters.value = {
    language: 'km',
    order_by: 'verse_number',
  };
  pageIndex.value = 1;
  pageSize.value = 10;
  loadVerses();
}

async function deleteVerse(id) {
  if (!confirm('Are you sure you want to delete this verse?')) return;
  try {
    await VerseService.deleteVerse(id);
    await loadVerses();
  } catch (err) {
    console.error('Failed to delete verse', err);
    alert(err.response?.data?.detail || 'Failed to delete verse.');
  }
}

function goToPrevPage() {
  if (pageIndex.value <= 1) return;
  pageIndex.value -= 1;
  loadVerses();
}

function goToNextPage() {
  if (totalPages.value && pageIndex.value >= totalPages.value) return;
  pageIndex.value += 1;
  loadVerses();
}

function goToCreateVerse() {
  const params = {};
  if (chapterId.value) {
    params.chapterId = chapterId.value;
  }
  router.push({ name: 'adminVerseCreate', params });
}

function syncContext() {
  if (chapterId.value) {
    setLastChapterId(chapterId.value);
  }
  if (bibleId.value) {
    setLastBibleId(bibleId.value);
  }
}

const pageStart = computed(() => {
  if (!totalElements.value) return 0;
  return (pageIndex.value - 1) * pageSize.value + 1;
});

const pageEnd = computed(() => {
  if (!totalElements.value) return 0;
  return Math.min(pageIndex.value * pageSize.value, totalElements.value);
});

watch(
  () => route.params.chapterId,
  (newId) => {
    chapterId.value = newId;
    pageIndex.value = 1;
    loadChapter();
    loadVerses();
  },
  { immediate: false }
);

watch(
  () => chapterId.value,
  () => syncContext(),
  { immediate: true }
);

watch(
  () => bibleId.value,
  () => syncContext(),
  { immediate: true }
);

onMounted(() => {
  loadChapter();
  loadVerses();
  syncContext();
});
</script>
