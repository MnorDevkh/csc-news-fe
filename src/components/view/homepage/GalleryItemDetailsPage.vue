<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftOutlined, DownloadOutlined, ShareAltOutlined, CameraOutlined, CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();
const galleryId = ref(null);
const itemId = ref(null);
const itemDetails = ref(null);

onMounted(() => {
  galleryId.value = route.params.galleryId;
  itemId.value = route.params.itemId;
  // In a real app, fetch specific item details based on galleryId and itemId
  setTimeout(() => {
    itemDetails.value = {
      id: itemId.value,
      title: `Moment of Prayer ${itemId.value}`,
      description: 'The faithful gathering for the evening prayer service at the Cathedral. A moment of silence and reflection captured brilliantly.',
      src: 'https://images.unsplash.com/photo-1506744038136-462a42ee705c?q=80&w=2070&auto=format&fit=crop',
      metadata: {
        'Photographer': 'John Doe',
        'Date Taken': 'Aug 10, 2025',
        'Resolution': '4K (3840x2160)',
        'Location': 'Phnom Penh'
      }
    };
  }, 300);
});
</script>

<template>
  <div class="min-h-screen bg-black/95 py-8 font-sans flex flex-col items-center justify-center">

    <div class="w-full max-w-6xl px-4 flex justify-between items-center mb-6 text-white">
      <button @click="router.back()" class="flex items-center gap-2 hover:text-blue-400 transition-colors">
        <ArrowLeftOutlined /> Back to Gallery
      </button>
      <div class="flex gap-4">
        <button class="flex items-center gap-2 hover:text-blue-400 transition-colors">
          <ShareAltOutlined /> <span class="hidden sm:inline">Share</span>
        </button>
        <button class="flex items-center gap-2 hover:text-blue-400 transition-colors">
          <DownloadOutlined /> <span class="hidden sm:inline">Download</span>
        </button>
      </div>
    </div>

    <div v-if="itemDetails"
      class="w-full max-w-6xl bg-transparent rounded-lg overflow-hidden flex flex-col md:flex-row gap-8 px-4">

      <!-- Image Container -->
      <div
        class="md:w-3/4 bg-black flex items-center justify-center rounded-lg overflow-hidden shadow-2xl border border-gray-800">
        <img :src="itemDetails.src" :alt="itemDetails.title" class="max-w-full max-h-[80vh] object-contain" />
      </div>

      <!-- Details Sidebar -->
      <div class="md:w-1/4 text-white p-4 md:p-0">
        <h1 class="text-2xl font-bold mb-4">{{ itemDetails.title }}</h1>
        <p class="text-gray-300 mb-8 leading-relaxed">{{ itemDetails.description }}</p>

        <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Image
            Details</h3>
          <div class="space-y-4">
            <div v-for="(value, key) in itemDetails.metadata" :key="key" class="flex flex-col">
              <span class="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <CameraOutlined v-if="key === 'Photographer'" />
                <CalendarOutlined v-else-if="key === 'Date Taken'" />
                <InfoCircleOutlined v-else />
                {{ key }}
              </span>
              <span class="text-sm font-medium">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-else class="text-white flex justify-center py-20">
      <a-spin size="large" />
    </div>

  </div>
</template>

<style scoped></style>