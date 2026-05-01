<template>
  <div class="bg-white p-6 rounded-md shadow-sm border border-gray-200">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Bible Types</h2>
        <p class="text-gray-500 text-sm">
          Manage bible types used to categorize different translations and editions.
        </p>
      </div>
      <button
        @click="goToCreate"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
      >
        <PlusOutlined />
        <span>Create Bible Type</span>
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thumbnail
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              Loading bible types...
            </td>
          </tr>
          <tr v-else-if="!types.length">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              No bible types found.
            </td>
          </tr>
          <tr
            v-else
            v-for="type in types"
            :key="type.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4">
              <img
                v-if="type.thumbnail"
                :src="type.thumbnail"
                alt="Thumb"
                class="h-10 w-10 rounded object-cover border border-gray-200"
              />
              <div
                v-else
                class="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs"
              >
                No Img
              </div>
            </td>
            <td class="px-6 py-4 text-sm font-mono text-gray-700">
              {{ type.id }}
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">
                {{ type.name }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ type.slug || '-' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600 max-w-xs">
              <span class="line-clamp-2">
                {{ type.description || '-' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  @click="goToType(type.id)"
                  class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded inline-flex items-center gap-1"
                >
                  <BookOutlined />
                  <span class="hidden sm:inline">Manage Bibles</span>
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
import { PlusOutlined, BookOutlined } from '@ant-design/icons-vue';
import { BibleService } from '@/services/BibleService';

const router = useRouter();

const types = ref([]);
const loading = ref(false);

async function loadBibleTypes() {
  loading.value = true;
  try {
    const data = await BibleService.getBibleTypes();
    const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
    types.value = items;
  } catch (error) {
    console.error('Failed to load bible types', error);
    types.value = [];
  } finally {
    loading.value = false;
  }
}

function goToCreate() {
  router.push({ name: 'adminBibleTypeCreate' });
}

function goToType(typeId) {
  if (!typeId) return;
  router.push({ name: 'adminBibleManagement', query: { bible_type_code: typeId } });
}

onMounted(() => {
  loadBibleTypes();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
</style>
