<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { MediaService } from '../../services/MediaService';

const route = useRoute();
const { t } = useI18n();
const gallery = ref(null);
const loading = ref(true);

onMounted(async () => {
  const galleryId = route.params.id;
  gallery.value = await MediaService.getGalleryAlbumById(galleryId);
  loading.value = false;
});
</script>

<template>
  <div class="w-full min-h-screen flex justify-center items-start px-3 py-3 sm:p-6 lg:p-8 box-border">
    <div class="w-full max-w-7xl mx-auto bg-white rounded-md shadow-md p-4 sm:p-8 lg:px-12 lg:py-10">
      <div v-if="loading" class="flex justify-center items-center min-h-64 w-full">
        <a-spin size="large" />
      </div>

      <div v-else-if="gallery">
        <header class="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200 text-left">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-3 leading-tight">
            {{ gallery.title }}
          </h1>
          <p class="text-[0.9375rem] sm:text-lg text-gray-600 mb-2 leading-relaxed">
            {{ gallery.description }}
          </p>
          <div class="flex items-center justify-start gap-4 flex-wrap text-sm text-gray-400">
            <span>{{ gallery.date }}</span>
            <span>{{ t('gallery.itemsCount', { count: gallery.itemCount }) }}</span>
          </div>
        </header>

        <div class="columns-1 gap-4 sm:columns-2 sm:gap-5 md:columns-3 md:gap-6 lg:columns-4 lg:gap-6">
          <div
            v-for="item in gallery.itemList"
            :key="item.id"
            class="break-inside-avoid mb-4 sm:mb-5 md:mb-6"
          >
            <div class="bg-white rounded-md overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg">
              <div class="w-full [&_.ant-image-img]:w-full [&_.ant-image-img]:h-auto [&_.ant-image-img]:block">
                <a-image
                  :src="item.imageUrl"
                  :alt="item.title"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 px-4">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
          {{ t('gallery.notFound') }}
        </h2>
        <router-link
          to="/galleries"
          class="text-blue-500 no-underline inline-block mt-2 hover:underline"
        >
          {{ t('gallery.backToGalleries') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
