<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  preacher: {
    type: String,
    required: true,
  },
  snippet: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <RouterLink :to="{ name: 'dailySermonDetail', params: { id: id } }" class="block group">
    <div class="flex flex-col bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 transition-shadow duration-300 group-hover:shadow-md h-full">
      <div class="flex flex-col justify-between h-full">
        <div>
          <h3 class="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">{{ title }}</h3>
          <p class="text-sm text-gray-500 mt-1">
          <template v-if="preacher">by {{ preacher }}</template>
          <template v-if="date">{{ preacher ? ' · ' : '' }}{{ date }}</template>
        </p>
        </div>
        <blockquote class="mt-4 text-gray-700 leading-relaxed border-l-4 border-gray-200 pl-4">
          <p>"{{ snippet }}..."</p>
        </blockquote>
      </div>
    </div>
  </RouterLink>
</template>
