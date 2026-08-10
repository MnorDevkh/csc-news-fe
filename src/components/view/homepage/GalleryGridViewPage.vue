<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { MediaService } from '../../../services/MediaService';
import { PictureOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';

const { t } = useI18n();

const galleries = ref([]);
const loading = ref(true);
const error = ref(null);

const props = defineProps({
  showControls: {
    type: Boolean,
    default: true
  }
});

const sortOption = ref('date');

const sortedGalleries = computed(() => {
  const list = [...galleries.value];
  const recentlyAdded = t('gallery.recentlyAdded');
  if (sortOption.value === 'title') {
    list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  } else if (sortOption.value === 'count') {
    list.sort((a, b) => (b.itemCount || 0) - (a.itemCount || 0));
  } else {
    list.sort((a, b) => {
      const da = a.date && a.date !== recentlyAdded ? new Date(a.date) : new Date(0);
      const db = b.date && b.date !== recentlyAdded ? new Date(b.date) : new Date(0);
      return db - da;
    });
  }
  return list;
});

onMounted(async () => {
  try {
    galleries.value = await MediaService.getGalleryAlbums();
  } catch (e) {
    console.error('Failed to load galleries', e);
    error.value = t('gallery.loadFailed');
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="w-full">
    <!-- Sort controls -->
    <div v-if="showControls && !loading && galleries.length" class="flex justify-end mb-4 sm:mb-6">
      <div class="relative inline-flex items-center group">
        <span class="mr-3 text-sm font-medium text-gray-500 group-hover:text-[#4165d1] transition-colors">{{ t('gallery.sortBy') }}</span>
        <select v-model="sortOption" class="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-[#4165d1]/10 focus:border-[#4165d1] cursor-pointer text-sm transition-all shadow-sm hover:border-[#4165d1]/30">
          <option value="date">{{ t('gallery.sortDate') }}</option>
          <option value="title">{{ t('gallery.sortTitle') }}</option>
          <option value="count">{{ t('gallery.sortCount') }}</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <a-spin size="large" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-10 sm:py-16">
      <PictureOutlined class="text-5xl text-gray-300 mb-4" />
      <p class="text-gray-500">{{ error }}</p>
    </div>

    <!-- Empty -->
    <div v-else-if="!galleries.length" class="text-center py-10 sm:py-16">
      <PictureOutlined class="text-5xl text-gray-300 mb-4" />
      <p class="text-gray-500 text-lg">{{ t('gallery.empty') }}</p>
      <p class="text-gray-400 text-sm mt-1">{{ t('gallery.checkBack') }}</p>
    </div>

    <!-- Gallery grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <div v-for="gallery in sortedGalleries" :key="gallery.id">
        <RouterLink :to="{ name: 'singleGalleryView', params: { id: gallery.id } }" class="block group h-full">
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-[#4165d1]/15 h-full flex flex-col">
            <div class="relative overflow-hidden aspect-[4/3]">
               <img
                 v-if="gallery.thumbnail"
                 :alt="gallery.title"
                 :src="gallery.thumbnail"
                 class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
               />
               <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                 <PictureOutlined class="text-3xl" />
               </div>
               <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
               <div class="absolute bottom-2 right-2 bg-[#e02838]/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold shadow-sm">
                  <PictureOutlined /> {{ gallery.itemCount }}
               </div>
            </div>
            
            <div class="p-4 flex flex-col flex-grow">
              <h3 class="font-bold text-gray-800 text-lg mb-2 line-clamp-1 group-hover:text-[#4165d1] transition-colors">{{ gallery.title }}</h3>
              <p class="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{{ gallery.description }}</p>
              
              <div class="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
                 <span class="text-xs text-gray-400">
                    {{ gallery.date || t('gallery.recentlyAdded') }}
                 </span>
                 <span class="text-xs font-semibold text-[#4165d1] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 flex items-center gap-1">
                    {{ t('gallery.viewAlbum') }} <ArrowRightOutlined />
                 </span>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
