<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const galleries = ref([
  { id: 301, title: 'Nature Landscapes', description: 'Stunning views from around the world.', thumbnail: 'https://images.unsplash.com/photo-150185414080-9d01900cdb0a?q=80&w=1974&auto=format&fit=crop', itemCount: 15, date: '2023-08-10' },
  { id: 302, title: 'Urban Exploration', description: 'Capturing the essence of city life.', thumbnail: 'https://images.unsplash.com/photo-1519046904884-53103b46652e?q=80&w=2070&auto=format&fit=crop', itemCount: 22, date: '2023-09-01' },
  { id: 303, title: 'Wildlife Encounters', description: 'Close-up shots of animals in their habitat.', thumbnail: 'https://images.unsplash.com/photo-1509233725247-49e657a911d2?q=80&w=1974&auto=format&fit=crop', itemCount: 18, date: '2023-07-20' },
]);

const sortOption = ref('date'); // 'date', 'popularity'
</script>

<template>
  <div class="gallery-grid-view-page">
    <h1>Image & Video Galleries</h1>
    <div class="sort-options">
      Sort by:
      <select v-model="sortOption">
        <option value="date">Date</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
    <div class="galleries-grid">
      <div v-for="gallery in galleries" :key="gallery.id" class="gallery-card">
        <RouterLink :to="{ name: 'singleGalleryView', params: { id: gallery.id } }">
          <img :src="gallery.thumbnail" :alt="gallery.title" class="gallery-thumbnail" />
          <h3>{{ gallery.title }}</h3>
          <p class="gallery-description">{{ gallery.description }}</p>
          <span class="item-count">{{ gallery.itemCount }} items</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery-grid-view-page {
  max-width: 1200px;
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
.sort-options {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #555;
}
.sort-options select {
  margin-left: 0.5rem;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.galleries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
.gallery-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}
.gallery-card:hover {
  transform: translateY(-5px);
}
.gallery-card a {
  text-decoration: none;
  color: #333;
  display: block;
  padding: 1rem;
}
.gallery-thumbnail {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}
.gallery-card h3 {
  margin-top: 0;
  font-size: 1.1rem;
  color: #007bff;
}
.gallery-description {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}
.item-count {
  font-size: 0.8rem;
  color: #999;
}
</style>