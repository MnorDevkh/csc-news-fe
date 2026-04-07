<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Structure pages</h2>
        <p class="text-gray-500 text-sm">រចនាសម្ព័ន្ធព្រះសហគមន៍ — bishops, portfolios, committees</p>
      </div>
      <button
        type="button"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        @click="router.push({ name: 'createStructurePage' })"
      >
        <PlusOutlined />
        <span>New page</span>
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
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
              >
                Active
              </span>
              <span
                v-else
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
              >
                Draft
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  type="button"
                  class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                  title="Edit"
                  @click="router.push({ name: 'editStructurePage', params: { slug: row.slug } })"
                >
                  <EditOutlined />
                </button>
                <button
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

    <p v-if="!isLoading && !pages.length" class="text-center text-gray-500 py-8">No structure pages yet.</p>
    <p v-if="isLoading" class="text-center text-gray-500 py-8">Loading…</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { StructurePageService } from '@/services/StructurePageService';

const router = useRouter();
const pages = ref([]);
const isLoading = ref(true);

async function load() {
  isLoading.value = true;
  try {
    const data = await StructurePageService.listAdmin();
    pages.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error(e);
    pages.value = [];
    alert('Failed to load structure pages. Is your API token set?');
  } finally {
    isLoading.value = false;
  }
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
