<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <router-link :to="{ name: 'adminBibleManagement' }" class="hover:text-blue-600">Bible Management</router-link>
      <span>/</span>
      <span class="text-gray-800 font-medium">{{ bibleName || 'Chapters' }}</span>
    </nav>

    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Chapters</h2>
        <p class="text-gray-500 text-sm">Manage chapters</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="router.push({ name: 'adminBibleManagement' })"
          class="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Back to Bibles
        </button>
        <button
          @click="router.push({ name: 'adminChapterCreate', params: { bibleId } })"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <PlusOutlined />
          <span>Create Chapter</span>
        </button>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <div class="flex flex-wrap gap-4 flex-1">
        <div class="flex flex-col">
          <label class="text-xs font-medium text-gray-500 mb-1">Bible</label>
          <select
            v-model="bibleId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
          >
            <option value="">All Bibles</option>
            <option
              v-for="b in bibleOptions"
              :key="b.id"
              :value="b.id"
            >
              {{ b.name }}{{ b.language ? ` (${b.language})` : '' }}
            </option>
          </select>
        </div>
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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">Loading chapters...</td>
          </tr>
          <tr v-else-if="!chapters.length">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No chapters found.</td>
          </tr>
          <tr v-for="ch in chapters" :key="ch.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ ch.chapter_number }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ ch.title || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" :title="ch.summary">{{ ch.summary || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span
                v-if="ch.status === 'active'"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
              >
                Active
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                {{ ch.status || 'inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  @click="router.push({ name: 'adminVerseList', params: { chapterId: ch.id } })"
                  class="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                  title="Verses"
                >
                  <UnorderedListOutlined />
                </button>
                <button
                  @click="router.push({ name: 'adminChapterEdit', params: { bibleId, chapterId: ch.id } })"
                  class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                >
                  <EditOutlined />
                </button>
                <button @click="deleteChapter(ch.id)" class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
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
        chapters
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
import { PlusOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons-vue';
import { BibleService } from '@/services/BibleService';
import ChapterService from '@/services/ChapterService';
import { useBibleManagementContext } from '@/composables/useBibleManagementContext';

const route = useRoute();
const router = useRouter();
const { setLastBibleId } = useBibleManagementContext();

const bibleId = ref(route.query.bible || '');
const bibleName = ref('');
const chapters = ref([]);
const loading = ref(false);
const bibleOptions = ref([]);
const filters = ref({
  language: 'km',
  order_by: 'chapter_number',
});
const pageIndex = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const totalElements = ref(0);

async function loadBible() {
  if (!bibleId.value) return;
  try {
    const res = await BibleService.getBible(bibleId.value);
    bibleName.value = res.data?.name || 'Bible';
  } catch {
    bibleName.value = 'Bible';
  }
}

async function loadBibleOptions() {
  try {
    const res = await BibleService.getBibles({
      skip: 0,
      limit: 200,
      order_by: 'bible_number',
    });
    const data = res.data;
    bibleOptions.value = data?.items ?? (Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Failed to load bible options', err);
    bibleOptions.value = [];
  }
}

async function loadChapters() {
  loading.value = true;
  try {
    const page = pageIndex.value || 1;
    const size = pageSize.value || 100;

    const params = {
      skip: (page - 1) * size,
      limit: size,
      language: filters.value.language || undefined,
      order_by: filters.value.order_by || 'chapter_number',
    };

    const res = bibleId.value
      ? await ChapterService.getChaptersByBible(bibleId.value, params)
      : await ChapterService.getChapters(params);

    const data = res.data;
    const items = data?.items ?? (Array.isArray(data) ? data : []);
    chapters.value = items;

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
    console.error('Failed to load chapters', err);
    chapters.value = [];
  } finally {
    loading.value = false;
  }
}

async function deleteChapter(id) {
  if (!confirm('Are you sure you want to delete this chapter? Verses in it may be affected.')) return;
  try {
    await ChapterService.deleteChapter(id);
    await loadChapters();
  } catch (err) {
    console.error('Failed to delete chapter', err);
    alert(err.response?.data?.detail || 'Failed to delete chapter.');
  }
}

function applyFilters() {
  pageIndex.value = 1;
  loadChapters();
}

function resetFilters() {
  filters.value = {
    language: 'km',
    order_by: 'chapter_number',
  };
  pageIndex.value = 1;
  pageSize.value = 10;
  bibleId.value = '';

  const newQuery = { ...route.query };
  delete newQuery.bible;
  router.replace({ name: route.name, params: route.params, query: newQuery });

  loadChapters();
}

function goToPrevPage() {
  if (pageIndex.value <= 1) return;
  pageIndex.value -= 1;
  loadChapters();
}

function goToNextPage() {
  if (totalPages.value && pageIndex.value >= totalPages.value) return;
  pageIndex.value += 1;
  loadChapters();
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
  () => route.query.bible,
  (newId) => {
    bibleId.value = newId || '';
    loadBible();
    loadChapters();
  },
  { immediate: false }
);

function syncContext() {
  if (bibleId.value) {
    setLastBibleId(bibleId.value);
  }
}

watch(
  () => bibleId.value,
  () => syncContext(),
  { immediate: true }
);

onMounted(() => {
  loadBibleOptions();
  loadBible();
  loadChapters();
  syncContext();
});
</script>
