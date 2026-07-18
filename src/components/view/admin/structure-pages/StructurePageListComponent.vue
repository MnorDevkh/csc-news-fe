<template>
  <div class="bg-white p-6 rounded-md shadow-sm border border-gray-200">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Structure pages</h2>
        <p class="text-gray-500 text-sm">Structure pages — visual page builder</p>
      </div>
      <button
        v-can="['CREATE-STRUCTURE-PAGE']"
        type="button"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
        @click="router.push({ name: 'createStructurePage' })"
      >
        <PlusOutlined />
        <span>New page</span>
      </button>
    </div>

    <div
      v-if="loadError"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex flex-wrap items-center justify-between gap-3"
    >
      <span>{{ loadError }}</span>
      <button
        type="button"
        class="rounded-md bg-white border border-red-200 px-3 py-1.5 text-xs font-medium hover:bg-red-50"
        @click="load"
      >
        Retry
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="row in pages" :key="row.slug" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ row.title || '—' }}</div>
              <div v-if="row.excerpt" class="text-xs text-gray-500 max-w-md truncate" :title="row.excerpt">
                {{ row.excerpt }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm font-mono text-gray-600">{{ row.slug }}</td>
            <td class="px-6 py-4 text-center text-sm text-gray-600">{{ row.order_no }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span
                v-if="row.status === 'active'"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-100 text-green-800"
              >
                Active
              </span>
              <span
                v-else
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-gray-100 text-gray-800"
              >
                Draft
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  v-if="row.status === 'active'"
                  type="button"
                  class="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded"
                  title="View public page"
                  @click="viewPublic(row)"
                >
                  <EyeOutlined />
                </button>
                <button
                  v-can="['UPDATE-STRUCTURE-PAGE']"
                  type="button"
                  class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                  title="Edit"
                  @click="router.push({ name: 'editStructurePage', params: { slug: row.slug } })"
                >
                  <EditOutlined />
                </button>
                <button
                  v-can="['DELETE-STRUCTURE-PAGE']"
                  type="button"
                  class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                  title="Delete"
                  @click="confirmDelete(row)"
                >
                  <DeleteOutlined />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="!isLoading && !pages.length && !loadError" class="text-center text-gray-500 py-8">
      No structure pages yet.
    </p>
    <p v-if="isLoading" class="text-center text-gray-500 py-8">Loading…</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { StructurePageService } from '@/services/StructurePageService';

const router = useRouter();
const pages = ref([]);
const isLoading = ref(true);
const loadError = ref('');

async function load() {
  isLoading.value = true;
  loadError.value = '';
  try {
    const data = await StructurePageService.listAdmin();
    pages.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error(e);
    pages.value = [];
    loadError.value = 'Failed to load structure pages. Is your API token set?';
  } finally {
    isLoading.value = false;
  }
}

function viewPublic(row) {
  const routeData = router.resolve({ name: 'structurePage', params: { slug: row.slug } });
  window.open(routeData.href, '_blank');
}

async function confirmDelete(row) {
  if (!confirm(`Delete page "${row.slug}"? This cannot be undone.`)) return;
  try {
    await StructurePageService.remove(row.slug);
    await load();
  } catch (e) {
    console.error(e);
    alert('Delete failed.');
  }
}

onMounted(load);
</script>
