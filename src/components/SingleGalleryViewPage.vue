<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';

const route = useRoute();
const galleryId = ref(null);
const galleryTitle = ref('');
const galleryItems = ref([]);
const currentItemIndex = ref(0);

onMounted(() => {
  galleryId.value = route.params.id;
  // In a real app, fetch gallery details and items based on galleryId
  galleryTitle.value = `Gallery: ${galleryId.value}`;
  galleryItems.value = [
    { id: 'img1', src: 'https://images.unsplash.com/photo-1506744038136-462a42ee705c?q=80&w=2070&auto=format&fit=crop', title: 'Mountain View', description: 'A beautiful mountain landscape.' },
    { id: 'vid1', src: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Big Buck Bunny', description: 'Sample video from Blender Foundation.', type: 'video' },
    { id: 'img2', src: 'https://images.unsplash.com/photo-1470071459604-3b5ecda7abfa?q=80&w=1996&auto=format&fit=crop', title: 'Forest Path', description: 'Walking through a serene forest.' },
  ];
});

const currentItem = ref(null);
watch(currentItemIndex, (newIndex) => {
  currentItem.value = galleryItems.value[newIndex];
}, { immediate: true });

const nextItem = () => {
  if (currentItemIndex.value < galleryItems.value.length - 1) {
    currentItemIndex.value++;
  }
};

const prevItem = () => {
  if (currentItemIndex.value > 0) {
    currentItemIndex.value--;
  }
};
</script>

<template>
  <div class="single-gallery-view-page">
    <h1>{{ galleryTitle }}</h1>
    <div v-if="currentItem" class="gallery-item-display">
      <img v-if="currentItem.type !== 'video'" :src="currentItem.src" :alt="currentItem.title" class="main-media" />
      <video v-else :src="currentItem.src" controls class="main-media"></video>
      <h2>{{ currentItem.title }}</h2>
      <p>{{ currentItem.description }}</p>
      <div class="navigation-controls">
        <button @click="prevItem" :disabled="currentItemIndex === 0">Previous</button>
        <button @click="nextItem" :disabled="currentItemIndex === galleryItems.value.length - 1">Next</button>
      </div>
      <div class="thumbnail-carousel">
        <RouterLink
          v-for="(item, index) in galleryItems"
          :key="item.id"
          :to="{ name: 'galleryItemDetails', params: { galleryId: galleryId, itemId: item.id } }"
          :class="{ active: index === currentItemIndex }"
        >
          <img v-if="item.type !== 'video'" :src="item.src" :alt="item.title" class="carousel-thumbnail" />
          <video v-else :src="item.src" class="carousel-thumbnail"></video>
        </RouterLink>
      </div>
    </div>
    <p v-else>No items in this gallery.</p>
    <!-- Placeholder for sharing options and metadata -->
  </div>
</template>

<style scoped>
.single-gallery-view-page {
  max-width: 1000px;
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
.gallery-item-display {
  text-align: center;
  margin-bottom: 2rem;
}
.main-media {
  max-width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.navigation-controls button {
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
.navigation-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.thumbnail-carousel {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  overflow-x: auto;
}
.carousel-thumbnail {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid transparent;
  cursor: pointer;
}
.carousel-thumbnail.active {
  border-color: #007bff;
}
</style>