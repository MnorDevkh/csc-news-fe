<template>
  <div class="bg-white p-6 rounded-md shadow-sm border border-gray-200">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div class="min-w-0">
        <h2 class="text-2xl font-bold text-gray-800">Saints</h2>
        <p class="text-gray-500 text-sm">Manage stories and histories of Saints</p>
      </div>
      <button
        v-can="'CREATE-SAINT'"
        type="button"
        @click="goCreate"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
      >
        <PlusOutlined />
        <span>Add Saint</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="relative flex-1">
        <SearchOutlined class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Search saints..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
        >
      </div>
      <div class="flex items-center gap-3">
        <label class="text-sm text-gray-600">Status</label>
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <a-spin size="large" />
    </div>

    <div v-else-if="error" class="text-center py-10">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button
        type="button"
        class="text-blue-600 hover:text-blue-800 font-medium"
        @click="loadSaints"
      >
        Retry
      </button>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feast Day</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="saint in filteredSaints" :key="saint.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <img
                v-if="saint.image_url"
                :src="saint.image_url"
                class="h-10 w-10 rounded-md object-cover border border-gray-200 bg-gray-100"
                loading="lazy"
              >
              <div v-else class="h-10 w-10 rounded-md bg-gray-100 border border-gray-200" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              <div class="min-w-0">
                <div class="truncate">{{ saint.name }}</div>
                <div class="text-xs text-gray-500 truncate">/{{ saint.slug }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ saint.feast_day || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="saint.is_published ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-gray-50 text-gray-700 ring-1 ring-gray-200'"
              >
                {{ saint.is_published ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  v-can="'UPDATE-SAINT'"
                  type="button"
                  class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                  @click="goEdit(saint.id)"
                >
                  <EditOutlined />
                </button>
                <button
                  v-can="'DELETE-SAINT'"
                  type="button"
                  class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                  @click="confirmDelete(saint)"
                >
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
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { SaintService } from '@/services/SaintService';

const router = useRouter();

const loading = ref(true);
const error = ref('');
const saints = ref([]);

const search = ref('');
const statusFilter = ref('all');

const filteredSaints = computed(() => {
  const q = (search.value || '').trim().toLowerCase();
  const status = statusFilter.value;
  return (saints.value || [])
    .filter((s) => {
      if (status === 'published') return !!s.is_published;
      if (status === 'draft') return !s.is_published;
      return true;
    })
    .filter((s) => {
      if (!q) return true;
      const hay = `${s.name || ''} ${s.slug || ''} ${s.feast_day || ''}`.toLowerCase();
      return hay.includes(q);
    });
});

async function loadSaints() {
  loading.value = true;
  error.value = '';
  try {
    const data = await SaintService.getAdminSaints({ skip: 0, limit: 200 });
    saints.value = data?.items || [];
  } catch (e) {
    console.error('Failed to load admin saints:', e);
    const detail = e.response?.data?.detail;
    error.value = detail || e.message || 'Failed to load saints.';
    saints.value = [];
  } finally {
    loading.value = false;
  }
}

function goCreate() {
  router.push({ name: 'createSaint' });
}

function goEdit(id) {
  router.push({ name: 'editSaint', params: { id } });
}

function confirmDelete(saint) {
  Modal.confirm({
    title: 'Delete Saint',
    content: `Are you sure you want to delete "${saint?.name}"?`,
    okText: 'Delete',
    okType: 'danger',
    async onOk() {
      await SaintService.deleteSaint(saint.id);
      await loadSaints();
    },
  });
}

onMounted(() => {
  loadSaints();
});
</script>
