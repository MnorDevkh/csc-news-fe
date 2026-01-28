<script setup>
import { ref } from 'vue';
import BibleVerseCard from '../bible/BibleVerseCard.vue';

const dailyVerse = ref({
  id: 1, // Static ID for demonstration
  book: 'John',
  chapter: 3,
  verse: 16,
  text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
  date: 'January 28, 2026'
});
</script>

<template>
  <div class="daily-bible-section">
    <BibleVerseCard 
      :id="dailyVerse.id"
      :book="dailyVerse.book" 
      :chapter="dailyVerse.chapter" 
      :verse="dailyVerse.verse" 
      :text="dailyVerse.text"
      :date="dailyVerse.date"
    />
  </div>
</template>
