<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import { SearchOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();
const query = computed(() => route.query.q || '');
const results = ref([]);
const loading = ref(false);

const performSearch = () => {
  loading.value = true;
  // Simulate API search latency
  setTimeout(() => {
    results.value = [
      { id: 1, title: `Result for ${query.value} - 1`, snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', date: '2024-01-30', category: 'News' },
      { id: 2, title: `Result for ${query.value} - 2`, snippet: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', date: '2024-01-29', category: 'Bible' },
      { id: 3, title: `Result for ${query.value} - 3`, snippet: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.', date: '2024-01-28', category: 'Sermon' },
    ];
    loading.value = false;
  }, 800);
}

// Watch/Initial search logic
onMounted(() => {
  if (query.value) performSearch();
});

</script>

<template>
  <div class="w-full min-h-screen flex justify-center items-start p-4 sm:p-6 lg:p-8 box-border bg-gray-50">
    <div class="w-full max-w-4xl mx-auto py-8 px-4 sm:py-10 sm:px-6 lg:py-12 lg:px-8">

      <div class="mb-8 text-center sm:text-left">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Search Results
        </h1>
        <p class="text-gray-500 text-lg">
          Found {{ results.length }} results for <span class="font-semibold text-blue-600">"{{ query }}"</span>
        </p>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <a-spin size="large" />
      </div>

      <div v-else-if="results.length > 0" class="space-y-4">
        <div v-for="item in results" :key="item.id"
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
          @click="router.push(`/article/${item.id}`)">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md font-medium uppercase">{{
                  item.category }}</span>
                <span class="text-xs text-gray-400">{{ item.date }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                {{ item.title }}
              </h3>
              <p class="text-gray-600 line-clamp-2">
                {{ item.snippet }}
              </p>
            </div>
            <div
              class="hidden sm:flex h-10 w-10 bg-gray-50 rounded-full items-center justify-center group-hover:bg-blue-50 transition-colors">
              <ArrowRightOutlined class="text-gray-400 group-hover:text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <SearchOutlined class="text-6xl text-gray-200 mb-4" />
        <h3 class="text-xl font-medium text-gray-500">No results found</h3>
        <p class="text-gray-400">Try adjusting your search terms.</p>
      </div>

    </div>
  </div>
</template>