<script setup>
import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import { PageFlip } from 'page-flip';

const props = defineProps({
  pages: {
    type: Array,
    required: true,
  },
  showCover: {
    type: Boolean,
    default: true,
  },
  // Optional title for the cover page
  title: {
    type: String,
    default: '',
  },
});

const bookContainer = ref(null);
let pageFlip = null;

function destroyFlip() {
  if (pageFlip) {
    pageFlip.destroy();
    pageFlip = null;
  }
}

function initFlip() {
  if (!bookContainer.value) return;
  destroyFlip();

  pageFlip = new PageFlip(bookContainer.value, {
    width: 420,
    height: 600,
    size: 'stretch',
    minWidth: 300,
    maxWidth: 1400,
    minHeight: 420,
    maxHeight: 1800,
    maxShadowOpacity: 0.45,
    showCover: props.showCover,
    mobileScrollSupport: true,
  });

  pageFlip.loadFromHTML(bookContainer.value.querySelectorAll('.page'));
}

onMounted(() => {
  initFlip();
});

watch(
  () => props.pages,
  () => {
    // Rebuild when page images change (e.g. after PDF renders)
    initFlip();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  destroyFlip();
});
</script>

<template>
  <div class="w-full flex justify-center items-center overflow-hidden">
    <div class="flipbook" ref="bookContainer">
      <div v-if="props.showCover" class="page cover" data-density="hard">
        <div class="page-content">
          <h2 class="text-xl font-semibold">{{ props.title || 'The Messenger' }}</h2>
          <p class="text-sm opacity-80 mt-2">Click or drag to flip</p>
        </div>
      </div>

      <div v-for="(page, index) in props.pages" :key="index" class="page">
        <div class="page-content">
          <div v-if="page.type === 'image'" class="image-container">
            <img :src="page.url" :alt="'Page ' + (index + 1)" />
            <span class="page-number">{{ index + 1 }}</span>
          </div>
          <div v-else class="text-content">
            <h3 class="text-lg font-semibold">Page {{ index + 1 }}</h3>
            <p class="mt-2 text-sm text-gray-700">{{ page.content || '' }}</p>
            <span class="page-number">{{ index + 1 }}</span>
          </div>
        </div>
      </div>

      <div v-if="props.showCover" class="page cover" data-density="hard">
        <div class="page-content">
          <h2 class="text-xl font-semibold">The End</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flipbook {
  /* page-flip handles sizing */
}

.page {
  background-color: #fff;
  border: 1px solid rgba(148, 163, 184, 0.5);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.page-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
}

.cover {
  background-color: #0f172a;
  color: #fff;
  border: 1px solid rgba(2, 6, 23, 0.8);
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.page-number {
  position: absolute;
  bottom: 10px;
  right: 12px;
  font-size: 12px;
  color: rgba(100, 116, 139, 0.9);
  user-select: none;
}
</style>

