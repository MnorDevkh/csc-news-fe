<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MediaService } from '../../../services/MediaService';
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  CalendarOutlined,
  PictureOutlined,
  FolderOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();

const gallery = ref(null);
const loading = ref(true);
const error = ref(null);

const itemIndex = computed(() => {
  const raw = Number(route.params.itemId);
  return Number.isFinite(raw) ? raw - 1 : 0;
});

const currentItem = computed(() => {
  if (!gallery.value?.itemList?.length) return null;
  return gallery.value.itemList[itemIndex.value] || null;
});

const hasPrev = computed(() => itemIndex.value > 0);
const hasNext = computed(() =>
  gallery.value?.itemList && itemIndex.value < gallery.value.itemList.length - 1
);

function goToItem(newIndex) {
  router.replace({
    name: 'galleryItemDetails',
    params: {
      galleryId: route.params.galleryId,
      itemId: newIndex + 1,
    },
  });
}

function handleKeydown(e) {
  if (e.key === 'ArrowLeft' && hasPrev.value) goToItem(itemIndex.value - 1);
  if (e.key === 'ArrowRight' && hasNext.value) goToItem(itemIndex.value + 1);
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown);
  try {
    gallery.value = await MediaService.getGalleryAlbumById(route.params.galleryId);
  } catch (e) {
    console.error('Failed to load gallery item', e);
    error.value = 'Failed to load image details.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="w-full min-h-screen flex justify-center items-start px-3 py-3 sm:p-6 lg:p-8 box-border bg-[rgba(0,0,0,0.95)]">
    <div class="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
      <!-- Top bar -->
      <div class="flex justify-between items-center mb-4 sm:mb-6 text-white">
        <button
          @click="router.push({ name: 'singleGalleryView', params: { id: route.params.galleryId } })"
          class="flex items-center gap-2 hover:text-blue-400 transition-colors"
        >
          <ArrowLeftOutlined /> Back to Gallery
        </button>
        <div class="flex items-center gap-4">
          <span v-if="gallery && currentItem" class="text-sm text-gray-400">
            {{ itemIndex + 1 }} / {{ gallery.itemList.length }}
          </span>
          <a
            v-if="currentItem"
            :href="currentItem.imageUrl"
            target="_blank"
            class="flex items-center gap-2 hover:text-blue-400 transition-colors text-white"
          >
            <DownloadOutlined /> <span class="hidden sm:inline">Open Original</span>
          </a>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-white flex justify-center py-20">
        <a-spin size="large" />
      </div>

      <!-- Error -->
      <div v-else-if="error || !currentItem" class="text-center py-20">
        <PictureOutlined class="text-5xl text-gray-600 mb-4" />
        <p class="text-gray-400 text-lg">{{ error || 'Image not found in this album.' }}</p>
        <button
          @click="router.push({ name: 'singleGalleryView', params: { id: route.params.galleryId } })"
          class="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
        >
          Back to Gallery
        </button>
      </div>

      <!-- Content -->
      <div v-else class="w-full bg-transparent rounded-md overflow-hidden flex flex-col md:flex-row gap-8">
        <!-- Image container with prev/next navigation -->
        <div class="md:w-3/4 relative group">
          <div class="bg-black flex items-center justify-center rounded-md overflow-hidden shadow-2xl border border-gray-800">
            <img
              :src="currentItem.imageUrl"
              :alt="currentItem.title || 'Gallery image'"
              class="max-w-full max-h-[80vh] object-contain"
            />
          </div>

          <!-- Prev / Next overlays -->
          <button
            v-if="hasPrev"
            @click="goToItem(itemIndex - 1)"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <LeftOutlined />
          </button>
          <button
            v-if="hasNext"
            @click="goToItem(itemIndex + 1)"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <RightOutlined />
          </button>
        </div>

        <!-- Details Sidebar -->
        <div class="md:w-1/4 text-white p-4 md:p-0">
          <h1 class="text-2xl font-bold mb-2">{{ currentItem.title || `Photo ${itemIndex + 1}` }}</h1>
          <p v-if="gallery.description" class="text-gray-300 mb-6 leading-relaxed text-sm">{{ gallery.description }}</p>

          <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
              Details
            </h3>
            <div class="space-y-4">
              <div class="flex flex-col">
                <span class="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <FolderOutlined /> Album
                </span>
                <span class="text-sm font-medium">{{ gallery.title }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <CalendarOutlined /> Date
                </span>
                <span class="text-sm font-medium">{{ gallery.date }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <PictureOutlined /> Photos in Album
                </span>
                <span class="text-sm font-medium">{{ gallery.itemCount }}</span>
              </div>
            </div>
          </div>

          <!-- Thumbnail strip -->
          <div v-if="gallery.itemList.length > 1" class="mt-6">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">More from this album</h3>
            <div class="flex gap-2 overflow-x-auto pb-2">
              <div
                v-for="(img, idx) in gallery.itemList"
                :key="img.id"
                class="flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 cursor-pointer transition-all"
                :class="idx === itemIndex ? 'border-blue-500 ring-1 ring-blue-400' : 'border-gray-700 hover:border-gray-500 opacity-60 hover:opacity-100'"
                @click="goToItem(idx)"
              >
                <img :src="img.imageUrl" :alt="img.title" class="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
