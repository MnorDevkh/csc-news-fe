<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BibleService } from '@/services/BibleService';

const bibleItems = ref([]);
const router = useRouter();

onMounted(async () => {
  try {
    const data = await BibleService.getBibleTypes();

    if (Array.isArray(data)) {
      bibleItems.value = data;
    } else if (data && Array.isArray(data.items)) {
      bibleItems.value = data.items;
    } else {
      bibleItems.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch bible types:', error);
    bibleItems.value = [];
  }
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const navigateToDetail = (slug) => {
  if (!slug) return;
  router.push({ name: 'bible', query: { type: slug } });
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 flex justify-center">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">Bible Resources</h1>
      </div>
      <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="(item, index) in bibleItems" :key="index" @click="navigateToDetail(item.slug)" class="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
          <div class="flex-shrink-0 overflow-hidden">
            <img class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" :src="item.thumbnail && item.thumbnail !== 'string' ? item.thumbnail : 'https://images.unsplash.com/photo-1499652848871-1527a310b13a?q=80&w=1974&auto=format&fit=crop'" :alt="item.name" />
          </div>
          <div class="flex flex-1 flex-col justify-between p-6">
            <div class="flex-1">
              <p class="text-sm font-medium text-blue-600">
                <span class="uppercase tracking-wide">{{ item.slug }}</span>
              </p>
              <div class="mt-2 block">
                <p class="text-xl font-semibold text-gray-900">{{ item.name }}</p>
                <p class="mt-3 text-base text-gray-500 line-clamp-3">{{ item.description }}</p>
              </div>
            </div>
            <div v-if="item.create_at" class="mt-6 flex items-center">
              <div class="flex-shrink-0">
                <span class="sr-only">Date</span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Created</p>
                <div class="flex space-x-1 text-sm text-gray-500">
                  <time :datetime="item.create_at">{{ formatDate(item.create_at) }}</time>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>