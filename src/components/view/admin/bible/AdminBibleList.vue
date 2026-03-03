<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Bibles</h2>
        <p class="text-gray-500 text-sm">Manage Bibles, chapters, and verses</p>
      </div>
      <button
        @click="router.push({ name: 'adminBibleCreate' })"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
      >
        <PlusOutlined />
        <span>Create Bible</span>
      </button>
    </div>

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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              Loading bibles...
            </td>
          </tr>
          <tr v-else-if="!bibles.length">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              No bibles found.
            </td>
          </tr>
          <tr v-for="bible in bibles" :key="bible.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <img
                v-if="bible.thumbnail"
                :src="bible.thumbnail"
                alt="Thumb"
                class="h-10 w-10 rounded object-cover border border-gray-200"
              />
              <div v-else class="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Img</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ bible.name }}</div>
              <div v-if="bible.slug" class="text-xs text-gray-500">{{ bible.slug }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <span v-if="bible.type">
                {{ bibleTypesById[bible.type] || bible.type }}
              </span>
              <span v-else>-</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ bible.language || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span
                v-if="bible.status === 'active'"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
              >
                Active
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                {{ bible.status || 'inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  @click="router.push({ name: 'adminChapterList', query: { bible: bible.id } })"
                  class="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                  title="Chapters"
                >
                  <UnorderedListOutlined />
                </button>
                <button
                  @click="router.push({ name: 'adminBibleEdit', params: { id: bible.id } })"
                  class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                >
                  <EditOutlined />
                </button>
                <button @click="deleteBible(bible.id)" class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
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
        bibles
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

const route = useRoute();
const router = useRouter();
const bibles = ref([]);
const loading = ref(false);
const bibleTypesById = ref({});
const filters = ref({
  language: 'km',
  order_by: 'bible_number',
});
const pageIndex = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const totalElements = ref(0);

async function loadBibles() {
  loading.value = true;
  try {
    const page = pageIndex.value || 1;
    const size = pageSize.value || 100;

    const params = {
      skip: (page - 1) * size,
      limit: size,
      language: filters.value.language || undefined,
      order_by: filters.value.order_by || 'bible_number',
    };

    const type = route.query.type;
    if (type) {
      params.type = type;
    }

    const res = await BibleService.getBibles(params);
    const data = res.data;
    const items = data?.items ?? (Array.isArray(data) ? data : []);
    bibles.value = items;

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
    console.error('Failed to load bibles', err);
    bibles.value = [];
  } finally {
    loading.value = false;
  }
}

async function loadBibleTypes() {
  try {
    const data = await BibleService.getBibleTypes();
    const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
    bibleTypesById.value = items.reduce((acc, t) => {
      if (t && t.id) {
        acc[t.id] = t.name || t.id;
      }
      return acc;
    }, {});
  } catch (err) {
    console.error('Failed to load bible types', err);
    bibleTypesById.value = {};
  }
}

function applyFilters() {
  pageIndex.value = 1;
  loadBibles();
}

function resetFilters() {
  filters.value = {
    language: 'km',
    order_by: 'bible_number',
  };
  pageIndex.value = 1;
  pageSize.value = 10;
  loadBibles();
}

async function deleteBible(id) {
  if (!confirm('Are you sure you want to delete this bible? This may affect chapters and verses.')) return;
  try {
    await BibleService.deleteBible(id);
    await loadBibles();
  } catch (err) {
    console.error('Failed to delete bible', err);
    alert(err.response?.data?.detail || 'Failed to delete bible.');
  }
}

function goToPrevPage() {
  if (pageIndex.value <= 1) return;
  pageIndex.value -= 1;
  loadBibles();
}

function goToNextPage() {
  if (totalPages.value && pageIndex.value >= totalPages.value) return;
  pageIndex.value += 1;
  loadBibles();
}

const pageStart = computed(() => {
  if (!totalElements.value) return 0;
  return (pageIndex.value - 1) * pageSize.value + 1;
});

const pageEnd = computed(() => {
  if (!totalElements.value) return 0;
  return Math.min(pageIndex.value * pageSize.value, totalElements.value);
});

onMounted(() => {
  loadBibleTypes();
  loadBibles();
});

watch(
  () => route.query.type,
  () => {
    pageIndex.value = 1;
    loadBibles();
  },
);
</script>
