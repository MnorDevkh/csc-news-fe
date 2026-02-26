<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Bibles</h2>
        <p class="text-gray-500 text-sm">Manage Bibles, chapters, and verses</p>
      </div>
      <button
        @click="router.push({ name: 'adminBibleCreate' })"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
      >
        <PlusOutlined />
        <span>Create Bible</span>
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              Loading bibles...
            </td>
          </tr>
          <tr v-else-if="!bibles.length">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              No bibles found.
            </td>
          </tr>
          <tr v-for="bible in bibles" :key="bible.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <img
                v-if="bible.thumbnail"
                :src="bible.thumbnail"
                alt="Thumb"
                class="h-10 w-10 rounded object-cover border border-gray-200"
              />
              <div v-else class="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Img</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ bible.name }}</div>
              <div v-if="bible.slug" class="text-xs text-gray-500">{{ bible.slug }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ bible.type || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ bible.language || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span
                v-if="bible.status === 'active'"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
              >
                Active
              </span>
              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                {{ bible.status || 'inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  @click="router.push({ name: 'adminChapterList', params: { bibleId: bible.id } })"
                  class="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                  title="Chapters"
                >
                  <UnorderedListOutlined />
                </button>
                <button
                  @click="router.push({ name: 'adminBibleEdit', params: { id: bible.id } })"
                  class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                >
                  <EditOutlined />
                </button>
                <button @click="deleteBible(bible.id)" class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons-vue';
import { BibleService } from '@/services/BibleService';

const router = useRouter();
const bibles = ref([]);
const loading = ref(false);

async function loadBibles() {
  loading.value = true;
  try {
    const res = await BibleService.getBibles({ skip: 0, limit: 500 });
    const data = res.data;
    bibles.value = data?.items ?? (Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Failed to load bibles', err);
    bibles.value = [];
  } finally {
    loading.value = false;
  }
}

async function deleteBible(id) {
  if (!confirm('Are you sure you want to delete this bible? This may affect chapters and verses.')) return;
  try {
    await BibleService.deleteBible(id);
    await loadBibles();
  } catch (err) {
    console.error('Failed to delete bible', err);
    alert(err.response?.data?.detail || 'Failed to delete bible.');
  }
}

onMounted(() => {
  loadBibles();
});
</script>
