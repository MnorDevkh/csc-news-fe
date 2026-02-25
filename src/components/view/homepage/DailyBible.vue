<script setup>
import { ref, onMounted } from 'vue';
import BibleVerseCard from '../bible/BibleVerseCard.vue';
import { DailyReadingService } from '@/services/DailyReadingService';

const latestReading = ref(null);
const loading = ref(false);

function mapReadingToCard(reading) {
  if (!reading) return null;
  const reference = reading.reference || reading.title || '';

  // Try to split reference like "John 3:16" into parts; fallback to generic labels
  let book = reference;
  let chapter = '';
  let verse = '';
  const match = reference.match(/^([^0-9]+)\s+(\d+)(?::(\d+))?/);
  if (match) {
    book = match[1].trim();
    chapter = match[2];
    verse = match[3] || '';
  }

  return {
    id: reading.id,
    book: book || 'Daily Reading',
    chapter: chapter || '',
    verse: verse || '',
    text: reading.snippet || reading.content || '',
    date: formatDate(reading.reading_date),
  };
}

function formatDate(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

async function loadLatestReading() {
  loading.value = true;
  try {
    const data = await DailyReadingService.getAllReadings({ limit: 1 });
    const items = Array.isArray(data) ? data : data.items || [];
    latestReading.value = mapReadingToCard(items[0]);
  } catch (error) {
    console.error('Failed to load latest daily reading', error);
    latestReading.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadLatestReading();
});
</script>

<template>
  <div class="daily-bible-section">
    <div v-if="loading" class="text-sm text-gray-500 py-4 text-center">
      Loading daily reading...
    </div>
    <div v-else-if="!latestReading" class="text-sm text-gray-500 py-4 text-center">
      No daily reading available yet.
    </div>
    <BibleVerseCard
      v-else
      :id="latestReading.id"
      :book="latestReading.book"
      :chapter="latestReading.chapter"
      :verse="latestReading.verse"
      :text="latestReading.text"
      :date="latestReading.date"
    />
  </div>
</template>
