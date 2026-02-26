<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <router-link :to="{ name: 'adminBibleManagement' }" class="hover:text-blue-600">Bible Management</router-link>
      <span>/</span>
      <router-link
        v-if="bibleId"
        :to="{ name: 'adminChapterList', params: { bibleId } }"
        class="hover:text-blue-600"
      >
        {{ bibleName || 'Bible' }}
      </router-link>
      <span v-if="bibleId">/</span>
      <span class="text-gray-800 font-medium">{{ chapterTitle || 'Verses' }}</span>
    </nav>

    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Verses</h2>
        <p class="text-gray-500 text-sm">Manage verses for this chapter</p>
      </div>
      <div class="flex gap-2">
        <button
          v-if="bibleId"
          @click="router.push({ name: 'adminChapterList', params: { bibleId } })"
          class="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Back to Chapters
        </button>
        <button
          @click="router.push({ name: 'adminVerseCreate', params: { chapterId } })"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <PlusOutlined />
          <span>Create Verse</span>
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">Loading verses...</td>
          </tr>
          <tr v-else-if="!verses.length">
            <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No verses found.</td>
          </tr>
          <tr v-for="v in verses" :key="v.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ v.verse_number }}</td>
            <td class="px-6 py-4 text-sm text-gray-700 max-w-md truncate" :title="v.content">{{ v.content || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span
                v-if="v.status === 'active'"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
              >
                Active
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                {{ v.status || 'inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  @click="router.push({ name: 'adminVerseEdit', params: { chapterId, verseId: v.id } })"
                  class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                >
                  <EditOutlined />
                </button>
                <button @click="deleteVerse(v.id)" class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
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
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { BibleService } from '@/services/BibleService';
import ChapterService from '@/services/ChapterService';
import VerseService from '@/services/VerseService';
import { useBibleManagementContext } from '@/composables/useBibleManagementContext';

const route = useRoute();
const router = useRouter();
const { setLastChapterId, setLastBibleId } = useBibleManagementContext();

const chapterId = ref(route.params.chapterId);
const bibleId = ref(null);
const bibleName = ref('');
const chapterTitle = ref('');
const verses = ref([]);
const loading = ref(false);

async function loadChapter() {
  if (!chapterId.value) return;
  try {
    const res = await ChapterService.getChapter(chapterId.value);
    const ch = res.data;
    chapterTitle.value = ch.title || `Chapter ${ch.chapter_number}`;
    bibleId.value = ch.bible_id;
    if (ch.bible_id) {
      try {
        const bibleRes = await BibleService.getBible(ch.bible_id);
        bibleName.value = bibleRes.data?.name || 'Bible';
      } catch {
        bibleName.value = 'Bible';
      }
    }
  } catch {
    chapterTitle.value = 'Chapter';
  }
  syncContext();
}

async function loadVerses() {
  if (!chapterId.value) return;
  loading.value = true;
  try {
    const res = await VerseService.getVerses({
      chapter_id: chapterId.value,
      skip: 0,
      limit: 500,
      order_by: 'verse_number',
    });
    const data = res.data;
    verses.value = data?.items ?? (Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Failed to load verses', err);
    verses.value = [];
  } finally {
    loading.value = false;
  }
}

async function deleteVerse(id) {
  if (!confirm('Are you sure you want to delete this verse?')) return;
  try {
    await VerseService.deleteVerse(id);
    await loadVerses();
  } catch (err) {
    console.error('Failed to delete verse', err);
    alert(err.response?.data?.detail || 'Failed to delete verse.');
  }
}

function syncContext() {
  if (chapterId.value) {
    setLastChapterId(chapterId.value);
  }
  if (bibleId.value) {
    setLastBibleId(bibleId.value);
  }
}

watch(
  () => route.params.chapterId,
  (newId) => {
    chapterId.value = newId;
    loadChapter();
    loadVerses();
  },
  { immediate: false }
);

watch(
  () => chapterId.value,
  () => syncContext(),
  { immediate: true }
);

watch(
  () => bibleId.value,
  () => syncContext(),
  { immediate: true }
);

onMounted(() => {
  loadChapter();
  loadVerses();
  syncContext();
});
</script>
