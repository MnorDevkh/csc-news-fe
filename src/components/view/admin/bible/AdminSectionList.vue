<template>
  <div class="bg-white p-6 rounded-md shadow-sm border border-gray-200">
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <router-link :to="{ name: 'adminBibleManagement' }" class="hover:text-blue-600">Bible Management</router-link>
      <span>/</span>
      <router-link
        v-if="chapterId"
        :to="{ name: 'adminChapterEdit', params: { chapterId } }"
        class="hover:text-blue-600"
      >
        Chapter {{ chapterNumber !== null ? chapterNumber : '' }}
      </router-link>
      <span v-if="chapterId">/</span>
      <span class="text-gray-800 font-medium">Sections</span>
    </nav>

    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Sections</h2>
        <p class="text-gray-500 text-sm">Manage sections for this chapter</p>
      </div>
      <div class="flex gap-2">
        <button
          v-if="chapterId"
          @click="router.push({ name: 'adminChapterEdit', params: { chapterId } })"
          class="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Back to Chapter
        </button>
        <button
          v-if="chapterId"
          @click="goToCreateSection"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
        >
          <PlusOutlined />
          <span>Create Section</span>
        </button>
      </div>
    </div>

    <div v-if="!chapterId" class="py-8 text-center text-gray-500">
      <p>Select a chapter from the query (e.g. ?chapter_id=...).</p>
      <router-link :to="{ name: 'adminChapterList' }" class="text-blue-600 hover:underline mt-2 inline-block">Go to Chapters</router-link>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start verse</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End verse</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">Loading sections...</td>
          </tr>
          <tr v-else-if="!sections.length">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No sections found.</td>
          </tr>
          <tr v-for="s in sections" :key="s.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ s.order_no }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ s.title || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ s.start_verse }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ s.end_verse }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  @click="router.push({ name: 'adminSectionEdit', params: { sectionId: s.id }, query: { chapter_id: chapterId } })"
                  class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                >
                  <EditOutlined />
                </button>
                <button @click="deleteSection(s.id)" class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import ChapterService from '@/services/ChapterService';
import SectionService from '@/services/SectionService';

const route = useRoute();
const router = useRouter();

const chapterId = ref(route.query.chapter_id || null);
const chapterNumber = ref(null);
const sections = ref([]);
const loading = ref(false);

async function loadChapter() {
  if (!chapterId.value) return;
  try {
    const res = await ChapterService.getChapter(chapterId.value);
    chapterNumber.value = res.data?.chapter_number ?? null;
  } catch {
    chapterNumber.value = null;
  }
}

async function loadSections() {
  if (!chapterId.value) {
    sections.value = [];
    return;
  }
  loading.value = true;
  try {
    const res = await SectionService.getSectionsByChapter(chapterId.value, {
      skip: 0,
      limit: 200,
      order_by: 'order_no',
    });
    const data = res.data;
    sections.value = data?.items ?? (Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Failed to load sections', err);
    sections.value = [];
  } finally {
    loading.value = false;
  }
}

async function deleteSection(id) {
  if (!confirm('Are you sure you want to delete this section?')) return;
  try {
    await SectionService.deleteSection(id);
    await loadSections();
  } catch (err) {
    console.error('Failed to delete section', err);
    alert(err.response?.data?.detail || 'Failed to delete section.');
  }
}

function goToCreateSection() {
  router.push({
    name: 'adminSectionCreate',
    query: { chapter_id: chapterId.value },
  });
}

watch(
  () => route.query.chapter_id,
  (newId) => {
    chapterId.value = newId || null;
    loadChapter();
    loadSections();
  },
  { immediate: false }
);

onMounted(() => {
  loadChapter();
  loadSections();
});
</script>
