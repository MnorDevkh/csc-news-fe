<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { MediaService } from '../../services/MediaService';

const galleries = ref([]);

onMounted(async () => {
  galleries.value = await MediaService.getGalleryAlbums();
});

const sortOption = ref('date'); // 'date', 'popularity'
</script>

<template>
  <div class="mx-auto p-8 bg-white rounded-lg shadow-sm max-w-7xl">
    <div class="mb-6 text-right text-gray-600">
      <span class="mr-2">Sort by:</span>
      <select v-model="sortOption" class="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500">
        <option value="date">Date</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="gallery in galleries" :key="gallery.id">
        <RouterLink :to="{ name: 'singleGalleryView', params: { id: gallery.id } }" class="block no-underline">
          <a-card hoverable class="h-full transition-transform duration-200 hover:-translate-y-1">
            <template #cover>
              <img :alt="gallery.title" :src="gallery.thumbnail" class="h-48 w-full object-cover rounded-t-lg" />
            </template>
            <a-card-meta :title="gallery.title">
              <template #description>
                <p class="text-gray-600 text-sm line-clamp-2 mb-2">{{ gallery.description }}</p>
                <span class="text-xs text-gray-400">{{ gallery.itemCount }} items</span>
              </template>
            </a-card-meta>
          </a-card>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>