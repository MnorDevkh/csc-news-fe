<script setup>
import { ref } from 'vue';
import { ArrowRightOutlined } from '@ant-design/icons-vue';

const saintsList = ref([
  { id: 1, name: 'Saint Joseph', feastDay: 'March 19', bioSnippet: 'Patron saint of the universal Church.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNwXifz0SdFPHRIAJooxrnrYxhsGFd9PSh6fWTA9eoIOjXFO1AEtgoNocibVHVZjed0ICjOvK1O5ntLGSWrYhC0lpPjIrxBjit5qPxqNo&s' },
  { id: 2, name: 'Saint Peter', feastDay: 'June 29', bioSnippet: 'The first Pope and leader of the Apostles.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqkC6hmFFQvI6r3JROQlGvtgMUkdeCddA1Qg&s' },
  { id: 3, name: 'Saint Paul', feastDay: 'June 29', bioSnippet: 'The Apostle to the Gentiles.', imageUrl: 'https://i0.wp.com/christianpublishinghouse.co/wp-content/uploads/2021/05/Apostle-Paul-Praying-with-Others-in-Prison.jpg?fit=1200%2C675&ssl=1' },
]);
</script>

<template>
  <div class="w-full">
    <ul class="divide-y divide-gray-200">
      <li v-for="saint in saintsList" :key="saint.id" class="group">
        <a href="#" class="flex items-start gap-4 py-4 px-1 hover:bg-gray-50 transition-colors duration-200">
          <div class="flex-shrink-0">
            <img :src="saint.imageUrl" :alt="saint.name" class="h-25 w-40 rounded-md object-cover shadow-sm">
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">{{ saint.name }}</h4>
            <p class="text-sm text-gray-500">Feast Day: {{ saint.feastDay }}</p>
            <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ saint.bioSnippet }}</p>
          </div>
          <ArrowRightOutlined class="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
        </a>
      </li>
    </ul>
  </div>
</template>