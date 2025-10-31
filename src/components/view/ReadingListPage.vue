<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';

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
  applyFilter(); // Apply filter after loading data
});

// Watch for changes in readingList and save to local storage
watch(readingList, (newValue) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
}, { deep: true }); // Deep watch to detect changes within objects in the array

const removeArticle = (id: number) => {
  readingList.value = readingList.value.filter(item => item.id !== id);
  applyFilter();
};

const toggleReadStatus = (id: number) => {
  const item = readingList.value.find(item => item.id === id);
  if (item) item.read = !item.read;
  applyFilter();
};

const filteredReadingList = ref([]);

const applyFilter = () => {
  filteredReadingList.value = readingList.value.filter(item =>
    item.title.toLowerCase().includes(filterText.value.toLowerCase())
  );
};

// Use a computed property for filtered list to reactively update when readingList or filterText changes
const currentFilteredList = computed(() => {
  if (!filterText.value) return readingList.value;
  return readingList.value.filter(item =>
    item.title.toLowerCase().includes(filterText.value.toLowerCase())
  );
});

// Watch filterText to re-apply filter
watch(filterText, () => {
  applyFilter();
});
</script>

<template>
  <div class="reading-list-page">
    <h1>My Reading List</h1>
    <div class="filter-section">
      <input type="text" v-model="filterText" @input="applyFilter" placeholder="Filter articles..." />
      <button @click="applyFilter">Search</button>
    </div>
    <div v-if="currentFilteredList.length">
      <div v-for="item in currentFilteredList" :key="item.id" class="reading-list-item">
        <h3>{{ item.title }}</h3>
        <div class="item-meta">
          <span class="date">{{ item.date }}</span>
          <span :class="['status-tag', { read: item.read }]">{{ item.read ? 'Read' : 'Unread' }}</span>
        </div>
        <div class="item-actions">
          <button @click="toggleReadStatus(item.id)" :class="['action-btn', { 'mark-unread': item.read }]">
            {{ item.read ? 'Mark Unread' : 'Mark Read' }}
          </button>
          <button @click="removeArticle(item.id)" class="action-btn remove-btn">Remove</button>
        </div>
      </div>
    </div>
    <p v-else>Your reading list is empty or no matching articles found.</p>
  </div>
</template>

<style scoped>
.reading-list-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
h1 {
  color: #007bff;
  margin-bottom: 1.5rem;
}
.filter-section {
  margin-bottom: 1.5rem;
}
.filter-section input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 0.5rem;
}
.filter-section button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
.reading-list-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.reading-list-item h3 { /* Adjusted for better spacing */
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}
.item-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.item-meta .date {
  font-size: 0.85rem;
  color: #666;
}
.item-meta .status-tag {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
}
.item-meta .status-tag.read {
  background-color: #28a745; /* Green */
}
.item-meta .status-tag:not(.read) {
  background-color: #ffc107; /* Yellow/Orange */
}
.item-actions {
  display: flex;
  gap: 0.5rem;
}
.action-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  font-size: 0.85rem;
}
.action-btn.mark-unread {
  background-color: #6c757d; /* Grey for unread action */
}
.action-btn.remove-btn {
  background-color: #dc3545; /* Red for remove */
}
</style>