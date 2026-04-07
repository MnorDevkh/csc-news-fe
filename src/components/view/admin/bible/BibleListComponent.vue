<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Daily Bible Readings</h2>
        <p class="text-gray-500 text-sm">Manage daily scripture entries</p>
      </div>
      <button
        @click="goToCreate"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
      >
        <PlusOutlined />
        <span>Add Reading</span>
      </button>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="relative flex-1">
        <SearchOutlined class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchText"
          type="text"
          placeholder="Search by title or reference..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
        >
      </div>
      <input
        v-model="selectedDate"
        type="date"
        class="border border-gray-300 rounded-lg px-4 py-2 bg-white outline-none cursor-pointer"
      >
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
              Loading daily readings...
            </td>
          </tr>
          <tr v-else-if="!filteredReadings.length">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
              No daily readings found.
            </td>
          </tr>
          <tr
            v-for="reading in filteredReadings"
            :key="reading.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ reading.title }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ reading.reference || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ formatDate(reading.reading_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="reading.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'"
              >
                {{ reading.status || 'unknown' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  @click="editReading(reading.id)"
                  class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                >
                  <EditOutlined />
                </button>
                <button
                  @click="deleteReadingItem(reading.id)"
                  class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { DailyReadingService } from '@/services/DailyReadingService';

const router = useRouter();

const readings = ref([]);
const loading = ref(false);
const searchText = ref('');
const selectedDate = ref('');

const filteredReadings = computed(() => {
  const search = searchText.value.trim().toLowerCase();
  const dateFilter = selectedDate.value;

  return readings.value.filter((r) => {
    const matchesSearch =
      !search ||
      (r.title && r.title.toLowerCase().includes(search)) ||
      (r.reference && r.reference.toLowerCase().includes(search));

    const matchesDate =
      !dateFilter ||
      (r.reading_date && new Date(r.reading_date).toISOString().slice(0, 10) === dateFilter);

    return matchesSearch && matchesDate;
  });
});

function formatDate(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

async function loadReadings() {
  loading.value = true;
  try {
    const data = await DailyReadingService.getAllReadings();
    readings.value = Array.isArray(data) ? data : data.items || [];
  } catch (error) {
    console.error('Failed to load daily readings', error);
    alert('Failed to load daily readings');
  } finally {
    loading.value = false;
  }
}

function goToCreate() {
  router.push({ name: 'createDailyReading' });
}

function editReading(id) {
  router.push({ name: 'editDailyReading', params: { id } });
}

async function deleteReadingItem(id) {
  if (!confirm('Are you sure you want to delete this daily reading?')) return;
  try {
    await DailyReadingService.deleteReading(id);
    await loadReadings();
  } catch (error) {
    console.error('Failed to delete daily reading', error);
    alert('Failed to delete daily reading');
  }
}

onMounted(() => {
  loadReadings();
});
</script>
