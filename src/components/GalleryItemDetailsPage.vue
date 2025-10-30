<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const galleryId = ref(null);
const itemId = ref(null);
const itemDetails = ref(null);

onMounted(() => {
  galleryId.value = route.params.galleryId;
  itemId.value = route.params.itemId;
  // In a real app, fetch specific item details based on galleryId and itemId
  itemDetails.value = {
    id: itemId.value,
    title: `Item ${itemId.value} from Gallery ${galleryId.value}`,
    description: 'This is a detailed description of the gallery item, including relevant metadata like photographer and date.',
    src: 'https://images.unsplash.com/photo-1506744038136-462a42ee705c?q=80&w=2070&auto=format&fit=crop', // Example image
    metadata: { photographer: 'John Doe', date: '2023-08-10', resolution: '4K' }
  };
});
</script>

<template>
  <div class="gallery-item-details-page">
    <h1 v-if="itemDetails">{{ itemDetails.title }}</h1>
    <img v-if="itemDetails" :src="itemDetails.src" :alt="itemDetails.title" class="item-media" />
    <p v-if="itemDetails">{{ itemDetails.description }}</p>
    <div v-if="itemDetails && itemDetails.metadata" class="metadata">
      <h3>Metadata:</h3>
      <ul>
        <li v-for="(value, key) in itemDetails.metadata" :key="key">
          <strong>{{ key }}:</strong> {{ value }}
        </li>
      </ul>
    </div>
    <p v-else>Loading item details...</p>
    <!-- Placeholder for sharing/download options -->
  </div>
</template>

<style scoped>
.gallery-item-details-page {
  max-width: 800px;
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
.item-media {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}
.metadata {
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}
.metadata h3 {
  color: #333;
  margin-bottom: 0.75rem;
}
.metadata ul {
  list-style: none;
  padding: 0;
}
.metadata li {
  margin-bottom: 0.5rem;
  color: #555;
}
</style>