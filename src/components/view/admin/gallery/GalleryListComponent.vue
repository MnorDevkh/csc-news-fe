<template>
  <div class="bg-white p-6 rounded-md shadow-sm border border-gray-200">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Media Gallery</h2>
        <p class="text-gray-500 text-sm">Manage photo albums and galleries</p>
      </div>
      <router-link
        :to="{ name: 'adminGalleryCreate' }"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors inline-flex"
      >
        <PlusOutlined />
        <span>Create Album</span>
      </router-link>
    </div>

    <!-- Feedback banner -->
    <div v-if="feedbackMsg"
      class="mb-4 px-4 py-3 rounded-md text-sm flex items-center justify-between"
      :class="feedbackType === 'success'
        ? 'bg-green-50 text-green-700 border border-green-200'
        : 'bg-red-50 text-red-700 border border-red-200'"
    >
      <span>{{ feedbackMsg }}</span>
      <button type="button" @click="feedbackMsg = ''" class="ml-3 text-current opacity-60 hover:opacity-100">&times;</button>
    </div>

    <!-- Search (only show when albums exist) -->
    <div v-if="!loading && albums.length" class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="relative flex-1">
        <SearchOutlined class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search albums..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <a-spin size="large" />
    </div>

    <!-- Empty state -->
    <div v-else-if="!albums.length" class="flex flex-col items-center justify-center py-16">
      <PictureOutlined class="text-5xl text-gray-300 mb-4" />
      <p class="text-gray-500 text-lg mb-2">No albums yet</p>
      <p class="text-gray-400 text-sm mb-6">Create your first photo album to get started.</p>
      <router-link
        :to="{ name: 'adminGalleryCreate' }"
        class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors inline-flex items-center gap-2"
      >
        <PlusOutlined /> Create Album
      </router-link>
    </div>

    <!-- No search results -->
    <div v-else-if="!filteredAlbums.length" class="text-center py-12">
      <SearchOutlined class="text-4xl text-gray-300 mb-3" />
      <p class="text-gray-500">No albums matching "{{ searchQuery }}"</p>
    </div>

    <!-- Album grid -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="album in paginatedAlbums"
          :key="album.id"
          class="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all relative"
        >
          <div class="aspect-[4/3] bg-gray-100 relative overflow-hidden">
            <img
              v-if="album.cover"
              :src="album.cover"
              :alt="album.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100"
            >
              <PictureOutlined class="text-3xl" />
            </div>
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4"
            >
              <button
                type="button"
                class="bg-white text-gray-800 p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                title="Edit"
                @click="$router.push({ name: 'adminGalleryEdit', params: { id: album.id } })"
              >
                <EditOutlined />
              </button>
              <button
                type="button"
                class="bg-white text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                title="Delete"
                :disabled="deleting === album.id"
                @click="confirmDelete(album)"
              >
                <DeleteOutlined />
              </button>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-1 truncate">{{ album.title }}</h3>
            <div class="flex justify-between items-center text-xs text-gray-500">
              <span>{{ album.date }}</span>
              <span class="bg-gray-100 px-2 py-1 rounded-md text-gray-600 font-medium">{{ album.count }} items</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredAlbums.length > pageSize" class="mt-6 flex justify-end">
        <a-pagination
          v-model:current="currentPage"
          :total="filteredAlbums.length"
          :page-size="pageSize"
          show-less-items
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons-vue';
import { GalleryService } from '@/services/GalleryService';

const albums = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 12;
const deleting = ref(null);
const feedbackMsg = ref('');
const feedbackType = ref('success');

function showFeedback(msg, type = 'success') {
  feedbackMsg.value = msg;
  feedbackType.value = type;
  if (type === 'success') {
    setTimeout(() => { feedbackMsg.value = ''; }, 3000);
  }
}

watch(searchQuery, () => {
  currentPage.value = 1;
});

function mapAlbum(g) {
  const images = g.images || [];
  const date = g.create_at ? new Date(g.create_at).toISOString().slice(0, 10) : '\u2014';
  return {
    id: g.id,
    title: g.title || '',
    cover: g.cover || '',
    count: images.length,
    date,
    raw: g
  };
}

const filteredAlbums = computed(() => {
  const q = (searchQuery.value || '').trim().toLowerCase();
  if (!q) return albums.value;
  return albums.value.filter((a) => a.title.toLowerCase().includes(q));
});

const paginatedAlbums = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredAlbums.value.slice(start, start + pageSize);
});

async function loadAlbums() {
  loading.value = true;
  try {
    const data = await GalleryService.list();
    albums.value = (data.items || []).map(mapAlbum);
  } catch (e) {
    console.error('Failed to load galleries', e);
    albums.value = [];
    showFeedback('Failed to load galleries. Please refresh the page.', 'error');
  } finally {
    loading.value = false;
  }
}

async function confirmDelete(album) {
  if (!confirm(`Delete album "${album.title}"?`)) return;
  deleting.value = album.id;
  try {
    await GalleryService.delete(album.id);
    showFeedback(`Album "${album.title}" deleted.`);
    await loadAlbums();
  } catch (err) {
    console.error('Delete gallery failed', err);
    showFeedback('Failed to delete album. Please try again.', 'error');
  } finally {
    deleting.value = null;
  }
}

onMounted(() => {
  loadAlbums();
});
</script>
