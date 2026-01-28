<script setup>
import { ref } from 'vue';
import SermonCard from '../sermon/SermonCard.vue';

const dailySermon = ref({
  id: 1, // Static ID for demonstration
  title: 'The Good Shepherd',
  preacher: 'Bishop Olivier Schmitthaeusler',
  snippet: 'The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.'
});
</script>

<template>
  <div class="daily-sermon-section">
    <SermonCard 
      :id="dailySermon.id"
      :title="dailySermon.title"
      :preacher="dailySermon.preacher" 
      :snippet="dailySermon.snippet" 
    />
  </div>
</template>
