<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { DailyReadingService } from '@/services/DailyReadingService';

const props = defineProps({
  showControls: {
    type: Boolean,
    default: true,
  },
});

const latestReading = ref(null);
const loading = ref(false);

function extractPreviewText(reading) {
  const raw = reading?.snippet || reading?.content || '';
  if (!raw) return '';

  const s = String(raw).trim();
  // If content is block JSON like admin `NewsForm.vue`, try to pull first text block.
  if (s.startsWith('[') && s.endsWith(']')) {
    try {
      const blocks = JSON.parse(s);
      if (Array.isArray(blocks)) {
        const firstText = blocks.find((b) => b && b.type === 'text' && typeof b.html === 'string');
        if (firstText?.html) {
          return firstText.html.replace(/<[^>]*>/g, '').trim();
        }
      }
    } catch {
      // fall through
    }
  }
  // Basic HTML strip for legacy content.
  return s.replace(/<[^>]*>/g, '').trim();
}

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
    text: extractPreviewText(reading),
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
    const data = await DailyReadingService.getAllReadings({
      limit: 1,
      public_only: true,
    });
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
    <div
      v-else
      class="flex flex-col gap-4"
    >
      <div class="flex items-start gap-4">
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">
            អត្ថបទព្រះគម្ពីរប្រចាំថ្ងៃ
          </p>
          <h3 class="text-lg font-bold text-gray-900">
            <span>{{ latestReading.book }}</span>
            <span v-if="latestReading.chapter">
              &nbsp;{{ latestReading.chapter }}
              <span v-if="latestReading.verse">:{{ latestReading.verse }}</span>
            </span>
          </h3>
        
          <p
            v-if="latestReading.text"
            class="mt-3 text-sm text-gray-700 leading-relaxed line-clamp-3"
          >
            “{{ latestReading.text }}”
          </p>
          <p
            v-if="latestReading.date"
            class="text-xs text-gray-500 mt-1"
          >
            {{ latestReading.date }}
          </p>
        </div>
        <RouterLink
          :to="{ name: 'dailyBibleDetail', params: { id: latestReading.id } }"
          class="shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
        >
          អានលម្អិត
        </RouterLink>
      </div>

      <div
        v-if="props.showControls"
        class="flex items-center justify-between pt-2 border-t border-gray-100 text-xs"
      >
        <RouterLink
          :to="{ name: 'dailyBibleDetail', params: { id: latestReading.id } }"
          class="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <span>អានអត្ថបទពេញ</span>
        </RouterLink>
        <RouterLink
          :to="{ name: 'dailyBibleList' }"
          class="inline-flex items-center text-gray-500 hover:text-gray-700"
        >
          <span>មើលអត្ថបទទាំងអស់</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
