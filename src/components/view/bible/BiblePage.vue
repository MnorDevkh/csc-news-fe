<script setup>
import { BibleService } from '@/services/BibleService';
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const bibleItems = ref([]);
const isLoading = ref(false);
const route = useRoute();
const router = useRouter();

const bibleTypeOptions = [
  { value: 'NT', label: 'ព្រះគម្ពីរសម្ព័ន្ធមេត្រីថ្មី' },
  { value: 'OT', label: 'ព្រះគម្ពីរសម្ព័ន្ធមេត្រីចាស់' },
  { value: 'Introduction', label: 'សេចក្ដីណែនាំ' },
  { value: 'PW', label: 'ពាក្យកាព្យ' },
];

const selectedType = computed(() => route.query.type || 'NT');

const filters = ref({
  language: 'km',
  order_by: 'bible_number',
});

const pageIndex = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const totalElements = ref(0);

const fetchBibles = async () => {
  try {
    isLoading.value = true;

    const page = pageIndex.value || 1;
    const size = pageSize.value || 10;

    const params = {
      skip: (page - 1) * size,
      limit: size,
      language: filters.value.language || undefined,
      order_by: filters.value.order_by || 'bible_number',
      type: selectedType.value,
    };

    const res = await BibleService.getBibles(params);
    const data = res.data;
    const items = data?.items ?? (Array.isArray(data) ? data : []);

    bibleItems.value = items.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      description: item.description || 'No description available',
      thumbnail: item.thumbnail,
      create_at: item.create_at,
    }));

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
  } catch (error) {
    console.error('Failed to fetch bible list:', error);
    bibleItems.value = [];
    totalElements.value = 0;
    totalPages.value = 1;
    pageIndex.value = 1;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchBibles);

watch(
  () => route.query.type,
  () => {
    pageIndex.value = 1;
    fetchBibles();
  }
);

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const navigateToDetail = (id) => {
  router.push({ name: 'bible-detail', params: { id } });
};

const onTypeChange = (event) => {
  const newType = event.target.value;
  if (!newType || newType === selectedType.value) return;

  router.push({
    query: {
      ...route.query,
      type: newType,
    },
  });
};

const applyFilters = () => {
  pageIndex.value = 1;
  fetchBibles();
};

const resetFilters = () => {
  filters.value = {
    language: 'km',
    order_by: 'bible_number',
  };
  pageIndex.value = 1;
  pageSize.value = 10;
  fetchBibles();
};

const goToPrevPage = () => {
  if (pageIndex.value <= 1) return;
  pageIndex.value -= 1;
  fetchBibles();
};

const goToNextPage = () => {
  if (totalPages.value && pageIndex.value >= totalPages.value) return;
  pageIndex.value += 1;
  fetchBibles();
};

const pageStart = computed(() => {
  if (!totalElements.value) return 0;
  return (pageIndex.value - 1) * pageSize.value + 1;
});

const pageEnd = computed(() => {
  if (!totalElements.value) return 0;
  return Math.min(pageIndex.value * pageSize.value, totalElements.value);
});

const typeLabel = computed(() => {
  switch (selectedType.value) {
    case 'OT':
      return 'ព្រះគម្ពីរសម្ព័ន្ធមេត្រីចាស់';
    case 'Introduction':
      return 'សេចក្ដីណែនាំ';
    case 'PW':
      return 'ពាក្យកាព្យ';
    case 'NT':
    default:
      return 'ព្រះគម្ពីរសម្ព័ន្ធមេត្រីថ្មី';
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1
          class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl"
        >
          ប្រភេទព្រះគម្ពីរ {{ typeLabel }}
        </h1>
        <div class="mt-6 flex justify-center">
          <select
            :value="selectedType"
            @change="onTypeChange"
            class="inline-flex rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          >
            <option
              v-for="option in bibleTypeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <p class="mt-4 max-w-2xl mx-auto text-gray-600">
          ជ្រើសរើសកំណែព្រះគម្ពីរដើម្បីអានជំពូក និងខណ្ឌនៅខាងមុខ។
        </p>
      </div>

      <div class="mt-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
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
            />
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

      <div v-if="isLoading" class="flex justify-center mt-12">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>

      <div v-else class="mt-12">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(item, index) in bibleItems"
            :key="index"
            @click="navigateToDetail(item.id)"
            class="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
          >
            <div class="flex-shrink-0 overflow-hidden">
              <img
                class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                :src="
                  item.thumbnail && item.thumbnail !== 'string'
                    ? item.thumbnail
                    : 'https://images.unsplash.com/photo-1499652848871-1527a310b13a?q=80&w=1974&auto=format&fit=crop'
                "
                :alt="item.name"
              />
            </div>
            <div class="flex flex-1 flex-col justify-between p-6">
              <div class="flex-1">
                <p class="text-sm font-medium text-blue-600">
                  <span class="uppercase tracking-wide">{{ item.slug }}</span>
                </p>
                <div class="mt-2 block">
                  <p class="text-xl font-semibold text-gray-900">{{ item.name }}</p>
                  <p class="mt-3 text-base text-gray-500 line-clamp-3">
                    {{ item.description }}
                  </p>
                </div>
              </div>
              <div v-if="item.create_at" class="mt-6 flex items-center">
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Created</p>
                  <div class="flex space-x-1 text-sm text-gray-500">
                    <time :datetime="item.create_at">{{ formatDate(item.create_at) }}</time>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!isLoading && bibleItems.length === 0" class="col-span-full text-center text-gray-500 mt-8">
            មិនទាន់មានកំណែព្រះគម្ពីរសម្រាប់ប្រភេទនេះទេ។
          </div>
        </div>

        <div
          v-if="totalPages > 1"
          class="mt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-600"
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
    </div>
  </div>
</template>