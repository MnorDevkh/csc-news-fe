<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <router-link :to="{ name: 'adminBibleManagement' }" class="hover:text-blue-600">Bible Management</router-link>
      <span>/</span>
      <span class="text-gray-800 font-medium">{{ bibleName || 'Chapters' }}</span>
    </nav>

    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Chapters</h2>
        <p class="text-gray-500 text-sm">Manage chapters for this Bible</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="router.push({ name: 'adminBibleManagement' })"
          class="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Back to Bibles
        </button>
        <button
          @click="router.push({ name: 'adminChapterCreate', params: { bibleId } })"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <PlusOutlined />
          <span>Create Chapter</span>
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">Loading chapters...</td>
          </tr>
          <tr v-else-if="!chapters.length">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No chapters found.</td>
          </tr>
          <tr v-for="ch in chapters" :key="ch.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ ch.chapter_number }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ ch.title || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" :title="ch.summary">{{ ch.summary || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span
                v-if="ch.status === 'active'"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
              >
                Active
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                {{ ch.status || 'inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  @click="router.push({ name: 'adminVerseList', params: { chapterId: ch.id } })"
                  class="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                  title="Verses"
                >
                  <UnorderedListOutlined />
                </button>
                <button
                  @click="router.push({ name: 'adminChapterEdit', params: { bibleId, chapterId: ch.id } })"
                  class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                >
                  <EditOutlined />
                </button>
                <button @click="deleteChapter(ch.id)" class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                  <DeleteOutlined />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PlusOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons-vue';
import { BibleService } from '@/services/BibleService';
import ChapterService from '@/services/ChapterService';
import { useBibleManagementContext } from '@/composables/useBibleManagementContext';

const route = useRoute();
const router = useRouter();
const { setLastBibleId } = useBibleManagementContext();

const bibleId = ref(route.params.bibleId);
const bibleName = ref('');
const chapters = ref([]);
const loading = ref(false);

async function loadBible() {
  if (!bibleId.value) return;
  try {
    const res = await BibleService.getBible(bibleId.value);
    bibleName.value = res.data?.name || 'Bible';
  } catch {
    bibleName.value = 'Bible';
  }
}

async function loadChapters() {
  if (!bibleId.value) return;
  loading.value = true;
  try {
    const res = await ChapterService.getChaptersByBible(bibleId.value, {
      skip: 0,
      limit: 500,
      order_by: 'chapter_number',
    });
    const data = res.data;
    chapters.value = data?.items ?? (Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Failed to load chapters', err);
    chapters.value = [];
  } finally {
    loading.value = false;
  }
}

async function deleteChapter(id) {
  if (!confirm('Are you sure you want to delete this chapter? Verses in it may be affected.')) return;
  try {
    await ChapterService.deleteChapter(id);
    await loadChapters();
  } catch (err) {
    console.error('Failed to delete chapter', err);
    alert(err.response?.data?.detail || 'Failed to delete chapter.');
  }
}

watch(
  () => route.params.bibleId,
  (newId) => {
    bibleId.value = newId;
    loadBible();
    loadChapters();
  },
  { immediate: false }
);

function syncContext() {
  if (bibleId.value) {
    setLastBibleId(bibleId.value);
  }
}

watch(
  () => bibleId.value,
  () => syncContext(),
  { immediate: true }
);

onMounted(() => {
  loadBible();
  loadChapters();
  syncContext();
});
</script>
