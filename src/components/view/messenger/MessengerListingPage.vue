<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MessengerService } from '@/services/MessengerService';

const router = useRouter();

const issues = ref([]);
const loading = ref(true);
const error = ref('');

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
  error.value = '';
  try {
    const data = await MessengerService.getIssues({ skip: 0, limit: 100, is_published: true });
    issues.value = data.items || [];
  } catch (e) {
    console.error('Failed to load messenger issues', e);
    error.value = 'Failed to load issues. Please try again later.';
  } finally {
    loading.value = false;
  }
}

function goToDetail(issue) {
  router.push({ name: 'messengerDetail', params: { slug: issue.slug } });
}

onMounted(() => {
  loadIssues();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-6 sm:py-10">
    <div class="max-w-6xl mx-auto px-3 sm:px-5">
      <header class="mb-6 sm:mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">The Messenger</h1>
        <p class="text-gray-600 text-sm">
          Browse past issues of The Messenger magazine.
        </p>
      </header>

      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        <div v-for="n in 6" :key="n" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="h-40 bg-gray-200 rounded-lg mb-4" />
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div class="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>

      <div v-else-if="error" class="bg-white rounded-xl shadow-sm border border-red-100 p-6 text-center">
        <p class="text-red-600 text-sm mb-2">{{ error }}</p>
      </div>

      <div v-else-if="!issues.length" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <p class="text-gray-500 text-sm">No issues available yet.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <article
          v-for="issue in issues"
          :key="issue.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group flex flex-col"
          @click="goToDetail(issue)"
        >
          <div class="relative h-48 bg-gray-100 overflow-hidden">
            <img
              v-if="issue.thumbnail_url"
              :src="issue.thumbnail_url"
              :alt="issue.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-wide bg-gradient-to-br from-gray-100 to-gray-200"
            >
              The Messenger
            </div>
          </div>
          <div class="p-4 flex-1 flex flex-col">
            <h2 class="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {{ issue.title }}
            </h2>
            <p class="text-xs text-gray-500 mb-2">
              {{ formatDate(issue.issue_date) }}
            </p>
            <p class="text-sm text-gray-600 line-clamp-2 flex-1">
              {{ issue.description }}
            </p>
            <div class="mt-4 text-sm text-blue-600 font-medium flex items-center">
              View issue
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

