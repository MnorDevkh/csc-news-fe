<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
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
  imageUrl: {
    type: String,
    default: '',
  },
});

const shortUrl = computed(() => {
  const url = props.imageUrl;
  if (!url || url.length <= 50) return url;
  return url.slice(0, 24) + '…' + url.slice(-20);
});
</script>

<template>
  <RouterLink :to="{ name: 'dailyBibleDetail', params: { id: id } }" class="block group h-full">
    <figure class="flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-shadow duration-300 group-hover:shadow-md h-full">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :title="shortUrl"
        :alt="`${book} ${chapter}:${verse}`"
        class="w-full h-32 object-cover rounded-md mb-4"
      />
      <figcaption>
        <h3 class="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{{ book }} {{ chapter }}:{{ verse }}</h3>
        <p v-if="date" class="text-sm text-gray-500 mt-1">{{ date }}</p>
      </figcaption>
      <blockquote class="mt-4 text-gray-700 leading-relaxed border-l-4 border-gray-200 pl-4">
        <p>"{{ text }}"</p>
      </blockquote>
    </figure>
  </RouterLink>
</template>
