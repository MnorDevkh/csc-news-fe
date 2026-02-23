<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BibleService } from '../../../services/BibleService';
import ChapterService from '../../../services/ChapterService';
import { Pagination as APagination } from 'ant-design-vue';

const route = useRoute();
const router = useRouter();
const item = ref(null);
const loading = ref(false);
const pagination = ref({
  current: 1,
  pageSize: 12,
  total: 0,
});

const fetchChapters = async (bibleId, language) => {
  try {
    const chaptersResponse = await ChapterService.getChaptersByBible(bibleId, {
      skip: (pagination.value.current - 1) * pagination.value.pageSize,
      limit: pagination.value.pageSize,
      language: language,
      order_by: 'chapter_number'
    });
    if (chaptersResponse.data) {
      if (item.value) {
        item.value.chapters = chaptersResponse.data.items || [];
      }
      pagination.value.total = chaptersResponse.data.total_elements || 0;
    }
  } catch (error) {
    console.error("Failed to fetch chapters:", error);
    if (item.value) {
      item.value.chapters = [];
    }
    pagination.value.total = 0;
  }
};

const fetchData = async () => {
  loading.value = true;
  pagination.value.current = 1;
  try {
    const id = route.params.id;
    if (id) {
      const data = await BibleService.getBibleDetails(id);
      if (data) {
        item.value = data;
        await fetchChapters(id, item.value.language);
      }
    }
  } catch (error) {
    console.error("Failed to fetch bible details:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const onPageChange = (page, pageSize) => {
  pagination.value.current = page;
  pagination.value.pageSize = pageSize;
  if (item.value) {
    fetchChapters(item.value.id, item.value.language);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getThumbnail = (url) => {
  if (url && url !== 'string') return url;
  // Using the same fallback image as the main page for consistency
  return 'https://images.unsplash.com/photo-1499652848871-1527a310b13a?q=80&w=1974&auto=format&fit=crop';
};

const navigateToChapter = (id) => {
  router.push({ name: 'chapter-detail', params: { id } });
};

const formattedType = computed(() => {
  if (!item.value?.type) return '';
  switch (item.value.type) {
    case 'OT':
      return 'ព្រះគម្ពីរសញ្ញាចាស់';
    case 'NT':
      return 'ព្រះគម្ពីរសញ្ញាថ្មី';
    default:
      return item.value.type;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Navigation -->
      <div class="mb-8">
        <button @click="router.back()"
          class="group flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
          <svg class="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Categories
        </button>
      </div>

      <div v-if="item" class="text-center mb-8 sm:mb-12 p-4 sm:px-6 lg:px-8">
        <h1
          class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
          
          {{ formattedType }} 
        </h1>
       <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
          <!-- Explore chapters, verses, and media resources. -->
        </p> 
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!item" class="text-center py-20">
        <p class="text-gray-500 text-lg">No resource found.</p>
      </div>

      <!-- Detail View -->
      <div v-else class="overflow-hidden rounded-2xl">
        <div class="relative h-64 sm:h-80 md:h-96 w-full">
          <img class="h-full w-full object-cover" :src="getThumbnail(item.thumbnail)" :alt="item.name" />
          <div class="absolute top-2 right-2 flex gap-2">
            <span v-if="item.testament && item.testament !== 'string'"
              class="inline-flex items-center rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-blue-800 shadow-sm backdrop-blur-sm">
              {{ item.testament }}
            </span>
          </div>
        </div>

        <div class="p-4 sm:p-6 md:p-8">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-blue-600">
              <span v-if="item.language && item.language !== 'string'" class="uppercase tracking-wide">{{ item.language
                }}</span>
            </p>
          </div>
          <div class="mt-2 block">
            <h3 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ item.name }}</h3>
            <p class="mt-4 text-lg text-gray-500">{{ item.description }}</p>
          </div>

          <div class="mt-8 border-t pt-6">
            <div class="flex flex-col sm:flex-row gap-4">
              <a v-if="item.audio_url && item.audio_url !== 'string'" :href="item.audio_url" target="_blank"
                class="inline-flex justify-center items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                Listen to Audio
              </a>
              <a v-if="item.video_url && item.video_url !== 'string'" :href="item.video_url" target="_blank"
                class="inline-flex justify-center items-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm">
                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Video
              </a>
            </div>
          </div>
        </div>

        <!-- Related Resources -->
        <div v-if="item.chapters && item.chapters.length > 0" class="mt-8 sm:mt-12 px-4 sm:px-8">
          <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="chapter in item.chapters" :key="chapter.id" @click="navigateToChapter(chapter.id)"
              class="cursor-pointer bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  {{ chapter.title && chapter.title !== 'string' ? chapter.title : `Chapter ${chapter.chapter_number}`
                  }}
                </h3>
                <p v-if="chapter.summary && chapter.summary !== 'string'"
                  class="mt-2 text-sm text-gray-500 line-clamp-3">
                  {{ chapter.summary }}
                </p>
              </div>
            </div>
          </div>
          <div v-if="pagination.total > 0" class="pt-8 flex justify-center">
            <APagination v-model:current="pagination.current" :page-size="pagination.pageSize" :total="pagination.total"
              @change="onPageChange" show-less-items show-size-changer :page-size-options="['12', '24', '48', '96']" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>