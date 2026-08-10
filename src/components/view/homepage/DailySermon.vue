<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SermonCard from '../sermon/SermonCard.vue';
import { SermonService } from '@/services/SermonService';

const { t } = useI18n();

const sermons = ref([]);

function formatDate(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

onMounted(async () => {
  try {
    const data = await SermonService.getAllSermons({ limit: 5 });
    const list = Array.isArray(data) ? data : [];
    sermons.value = list.filter(
      (s) => s && s.id !== null && s.id !== undefined && String(s.id).trim() !== ''
    );
  } catch (error) {
    console.error('Failed to load sermons for homepage', error);
  }
});
</script>

<template>
  <div class="daily-sermon-section space-y-4">
    <div
      v-if="!sermons.length"
      class="text-center py-8 text-gray-500 text-sm"
    >
      {{ t('dailySermon.empty') }}
    </div>
    <SermonCard
      v-for="sermon in sermons"
      :key="sermon.id"
      :id="sermon.id"
      :title="sermon.title"
      :preacher="sermon.preacher || ''"
      :snippet="sermon.snippet || ''"
      :date="formatDate(sermon.sermon_date)"
    />
  </div>
</template>
