<template>
  <div class="bg-white p-6 rounded-md shadow-sm border border-gray-200">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">The Messenger</h2>
        <p class="text-gray-500 text-sm">Manage PDF issues for The Messenger magazine</p>
      </div>
      <button
        @click="goToCreate"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
      >
        <PlusOutlined />
        <span>New Issue</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="relative flex-1">
        <SearchOutlined class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchText"
          type="text"
          placeholder="Search issues..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
        />
      </div>
      <select
        v-model="publishedFilter"
        class="border border-gray-300 rounded-md px-4 py-2 bg-white outline-none cursor-pointer"
      >
        <option value="">All statuses</option>
        <option value="published">Published</option>
        <option value="unpublished">Unpublished</option>
      </select>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
              Loading issues...
            </td>
          </tr>
          <tr v-else-if="!filteredIssues.length">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
              No issues found.
            </td>
          </tr>
          <tr
            v-for="issue in filteredIssues"
            :key="issue.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <img
                v-if="issue.thumbnail_url"
                :src="issue.thumbnail_url"
                alt="Cover"
                class="h-12 w-20 object-cover rounded shadow-sm border border-gray-200"
              />
              <div
                v-else
                class="h-12 w-20 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs"
              >
                No Cover
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ issue.title }}</div>
              <div class="text-xs text-gray-500 line-clamp-1">
                {{ issue.description }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(issue.issue_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-md"
                :class="issue.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
              >
                {{ issue.is_published ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <button
                  @click="previewIssue(issue)"
                  class="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                  title="Preview"
                >
                  <EyeOutlined />
                </button>
                <button
                  @click="editIssue(issue.id)"
                  class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                  title="Edit"
                >
                  <EditOutlined />
                </button>
                <button
                  @click="deleteIssueItem(issue.id)"
                  class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <DeleteOutlined />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Simple preview modal: open PDF in iframe -->
    <div
      v-if="previewVisible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">
              {{ previewIssueItem?.title || 'Preview' }}
            </h3>
            <p class="text-xs text-gray-500">
              {{ previewIssueItem?.pdf_url }}
            </p>
          </div>
          <button
            class="text-gray-500 hover:text-gray-800"
            @click="closePreview"
          >
            &times;
          </button>
        </div>
        <div class="flex-1 overflow-hidden bg-gray-100">
          <iframe
            v-if="previewIssueItem?.pdf_url"
            :src="previewIssueItem.pdf_url"
            class="w-full h-full"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-gray-400 text-sm"
          >
            No PDF URL available
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { MessengerService } from '@/services/MessengerService';

const router = useRouter();

const issues = ref([]);
const loading = ref(false);
const searchText = ref('');
const publishedFilter = ref('');

const previewVisible = ref(false);
const previewIssueItem = ref(null);

const filteredIssues = computed(() => {
  const search = searchText.value.trim().toLowerCase();
  return issues.value.filter((i) => {
    const matchesStatus =
      !publishedFilter.value ||
      (publishedFilter.value === 'published' && i.is_published) ||
      (publishedFilter.value === 'unpublished' && !i.is_published);
    const matchesSearch =
      !search ||
      (i.title && i.title.toLowerCase().includes(search)) ||
      (i.description && i.description.toLowerCase().includes(search));
    return matchesStatus && matchesSearch;
  });
});

function formatDate(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    return d.toLocaleDateString();
  } catch {
    return value;
  }
}

async function loadIssues() {
  loading.value = true;
  try {
    const data = await MessengerService.getIssues({ skip: 0, limit: 100 });
    // service returns full paging object; use items array
    issues.value = data.items || [];
  } catch (error) {
    console.error('Failed to load messenger issues', error);
    alert('Failed to load messenger issues');
  } finally {
    loading.value = false;
  }
}

function goToCreate() {
  router.push({ name: 'createMessengerIssue' });
}

function editIssue(id) {
  router.push({ name: 'editMessengerIssue', params: { id } });
}

async function deleteIssueItem(id) {
  if (!confirm('Are you sure you want to delete this issue?')) return;
  try {
    await MessengerService.deleteIssue(id);
    await loadIssues();
  } catch (error) {
    console.error('Failed to delete issue', error);
    alert('Failed to delete issue');
  }
}

function previewIssue(issue) {
  previewIssueItem.value = issue;
  previewVisible.value = true;
}

function closePreview() {
  previewVisible.value = false;
  previewIssueItem.value = null;
}

onMounted(() => {
  loadIssues();
});
</script>

