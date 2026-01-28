<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { MediaService } from '../../../services/MediaService';
import { PictureOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';

const galleries = ref([]);

const props = defineProps({
  showControls: {
    type: Boolean,
    default: true
  }
});

onMounted(async () => {
  galleries.value = await MediaService.getGalleryAlbums();
});

const sortOption = ref('date'); // 'date', 'popularity'
</script>

<template>
  <div class="w-full">
    <div v-if="showControls" class="flex justify-end mb-6">
      <div class="relative inline-flex items-center group">
        <span class="mr-3 text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors">Sort by:</span>
        <select v-model="sortOption" class="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer text-sm transition-all shadow-sm hover:border-blue-300">
          <option value="date">Date</option>
          <option value="popularity">Popularity</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="gallery in galleries" :key="gallery.id">
        <RouterLink :to="{ name: 'singleGalleryView', params: { id: gallery.id } }" class="block group h-full">
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
            <div class="relative overflow-hidden aspect-[4/3]">
               <img :alt="gallery.title" :src="gallery.thumbnail" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
               <div class="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                  <PictureOutlined /> {{ gallery.itemCount }}
               </div>
            </div>
            
            <div class="p-4 flex flex-col flex-grow">
              <h3 class="font-bold text-gray-800 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{{ gallery.title }}</h3>
              <p class="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{{ gallery.description }}</p>
              
              <div class="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
                 <span class="text-xs text-gray-400">
                    {{ gallery.date || 'Recently Added' }}
                 </span>
                 <span class="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 flex items-center gap-1">
                    View Album <ArrowRightOutlined />
                 </span>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>