<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { DeleteOutlined, BookOutlined } from '@ant-design/icons-vue';

// Define a type for a reading list item for better type safety
interface ReadingListItem {
  id: number;
  title: string;
  date: string;
  read: boolean;
}

const STORAGE_KEY = 'csc-news-reading-list';

const readingList = ref<ReadingListItem[]>([]);

const filterText = ref('');

// Load reading list from local storage on component mount
onMounted(() => {
  const savedList = localStorage.getItem(STORAGE_KEY);
  if (savedList) {
    readingList.value = JSON.parse(savedList);
  } else {
    // Initialize with some sample data if local storage is empty
    readingList.value = [
      { id: 401, title: 'Sample Article 1: The Future of AI', date: '2023-10-01', read: false },
      { id: 402, title: 'Sample Article 2: Global Economic Trends', date: '2023-09-25', read: true },
      { id: 403, title: 'Sample Article 3: Breakthrough in Quantum Computing', date: '2023-10-15', read: false },
    ];
  }
});

// Watch for changes in readingList and save to local storage
watch(readingList, (newValue) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
}, { deep: true }); // Deep watch to detect changes within objects in the array

const removeArticle = (id: number) => {
  readingList.value = readingList.value.filter(item => item.id !== id);
};

const toggleReadStatus = (id: number) => {
  const item = readingList.value.find(item => item.id === id);
  if (item) item.read = !item.read;
};

// Use a computed property for filtered list to reactively update when readingList or filterText changes
const currentFilteredList = computed(() => {
  if (!filterText.value) return readingList.value;
  return readingList.value.filter(item =>
    item.title.toLowerCase().includes(filterText.value.toLowerCase())
  );
});

</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BookOutlined class="text-blue-600" />
          My Reading List
        </h1>
        <div class="relative max-w-md w-full md:w-auto">
          <input type="text" v-model="filterText" placeholder="Filter articles..."
            class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
        </div>
      </div>

      <div v-if="currentFilteredList.length" class="space-y-4">
        <div v-for="item in currentFilteredList" :key="item.id"
          class="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">

          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-800 mb-2" :class="{ 'line-through text-gray-400': item.read }">
              {{ item.title }}
            </h3>
            <div class="flex items-center gap-3 text-sm">
              <span class="text-gray-500">{{ item.date }}</span>
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold"
                :class="item.read ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                {{ item.read ? 'Read' : 'Unread' }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 self-start sm:self-center">
            <button @click="toggleReadStatus(item.id)"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
              :class="item.read ? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100' : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'">
              {{ item.read ? 'Mark Unread' : 'Mark Read' }}
            </button>
            <button @click="removeArticle(item.id)"
              class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
              <DeleteOutlined />
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <BookOutlined class="text-6xl text-gray-200 mb-4" />
        <h3 class="text-xl font-medium text-gray-500">Your list is empty</h3>
        <p class="text-gray-400 mt-1">Bookmark articles to read them later.</p>
      </div>

    </div>
  </div>
</template>