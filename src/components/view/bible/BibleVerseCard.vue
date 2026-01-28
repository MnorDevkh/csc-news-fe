<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  book: {
    type: String,
    required: true,
  },
  chapter: {
    type: [String, Number],
    required: true,
  },
  verse: {
    type: [String, Number],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <RouterLink :to="{ name: 'dailyBibleDetail', params: { id: id } }" class="block group h-full">
    <figure class="bible-verse-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-shadow duration-300 group-hover:shadow-md h-full">
      <div class="flex flex-col justify-between h-full">
        <figcaption>
          <h3 class="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{{ book }} {{ chapter }}:{{ verse }}</h3>
          <p vif="date" class="text-sm text-gray-500 mt-1">{{ date }}</p>
        </figcaption>
        <blockquote class="mt-4 text-gray-700 leading-relaxed border-l-4 border-gray-200 pl-4">
          <p>"{{ text }}"</p>
        </blockquote>
      </div>
    </figure>
  </RouterLink>
</template>

<style scoped>
.bible-verse-card {
  display: flex;
  flex-direction: column;
}
</style>
