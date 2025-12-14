<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { MediaService } from '../../services/MediaService';

const route = useRoute();
const gallery = ref(null);
const loading = ref(true);

onMounted(async () => {
  const galleryId = Number(route.params.id);
  gallery.value = await MediaService.getGalleryAlbumById(galleryId);
  loading.value = false;
});
</script>

<template>
  <div class="mx-auto p-8 bg-white rounded-lg shadow-sm max-w-7xl min-h-screen">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <a-spin size="large" />
    </div>
    
    <div v-else-if="gallery">
      <div class="mb-8 border-b border-gray-200 pb-6">
        <h1 class="text-3xl font-bold text-blue-600 mb-3">{{ gallery.title }}</h1>
        <p class="text-lg text-gray-600 mb-2">{{ gallery.description }}</p>
        <div class="flex items-center text-sm text-gray-400">
          <span class="mr-4">{{ gallery.date }}</span>
          <span>{{ gallery.itemCount }} items</span>
        </div>
      </div>

      <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        <div v-for="item in gallery.itemList" :key="item.id" class="break-inside-avoid">
          <div class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <a-image
              :src="item.imageUrl"
              :alt="item.title"
              class="w-full block"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-700">Gallery not found</h2>
      <router-link to="/galleries" class="text-blue-500 hover:underline mt-4 inline-block">Back to Galleries</router-link>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-image-img) {
  width: 100%;
  height: auto;
  display: block;
}
</style>