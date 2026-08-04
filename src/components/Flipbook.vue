<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue';
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
  title: {
    type: String,
    default: '',
  },
});

const bookContainer = ref(null);
const currentPage = ref(0);
const pageCount = ref(0);
const isLandscape = ref(true);
let pageFlip = null;

const canGoPrev = computed(() => currentPage.value > 0);
const canGoNext = computed(() => currentPage.value < Math.max(pageCount.value - 1, 0));
const isFrontCover = computed(
  () =>
    props.showCover &&
    isLandscape.value &&
    pageCount.value > 0 &&
    currentPage.value === 0
);
const isBackCover = computed(
  () =>
    props.showCover &&
    isLandscape.value &&
    pageCount.value > 1 &&
    currentPage.value === pageCount.value - 1
);
const isClosedBook = computed(() => isFrontCover.value || isBackCover.value);

const pageLabel = computed(() => {
  const total = pageCount.value || props.pages.length;
  if (!total) return '';
  const current = currentPage.value + 1;
  return `${current} / ${total}`;
});

function destroyFlip() {
  if (pageFlip) {
    pageFlip.off('flip');
    pageFlip.off('changeOrientation');
    pageFlip.destroy();
    pageFlip = null;
  }
}

function getPageElements() {
  return bookContainer.value?.querySelectorAll('.page') ?? [];
}

function syncPageState() {
  if (!pageFlip) return;
  currentPage.value = pageFlip.getCurrentPageIndex();
  pageCount.value = pageFlip.getPageCount();
  isLandscape.value = pageFlip.getOrientation() === 'landscape';
}

function initFlip() {
  if (!bookContainer.value) return;
  destroyFlip();

  pageFlip = new PageFlip(bookContainer.value, {
    width: 420,
    height: 600,
    size: 'stretch',
    minWidth: 280,
    maxWidth: 1400,
    minHeight: 400,
    maxHeight: 1800,
    maxShadowOpacity: 0.35,
    showCover: props.showCover,
    startPage: 0,
    mobileScrollSupport: true,
    usePortrait: true,
    autoSize: true,
  });

  pageFlip.loadFromHTML(getPageElements());
  pageFlip.on('flip', () => syncPageState());
  pageFlip.on('changeOrientation', (e) => {
    isLandscape.value = e.data === 'landscape';
    syncPageState();
  });
  syncPageState();
}

async function syncFlipPages() {
  await nextTick();
  if (!bookContainer.value) return;

  const items = getPageElements();
  if (!items.length) return;

  if (pageFlip) {
    const saved = pageFlip.getCurrentPageIndex();
    pageFlip.updateFromHtml(items);
    // Keep reader on the same page while later PDF pages stream in
    const max = Math.max(pageFlip.getPageCount() - 1, 0);
    pageFlip.turnToPage(Math.min(saved, max));
    syncPageState();
  } else {
    initFlip();
  }
}

function goPrev() {
  pageFlip?.flipPrev();
}

function goNext() {
  pageFlip?.flipNext();
}

function densityFor(index) {
  if (!props.showCover) return 'soft';
  const last = props.pages.length - 1;
  if (index === 0 || index === last) return 'hard';
  return 'soft';
}

onMounted(() => {
  syncFlipPages();
});

watch(
  () => props.pages,
  () => {
    syncFlipPages();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  destroyFlip();
});
</script>

<template>
  <div class="flipbook-wrap">
    <div
      class="flipbook-stage"
      :class="{
        'is-closed': isClosedBook,
        'is-front-cover': isFrontCover,
        'is-back-cover': isBackCover,
      }"
    >
      <div class="flipbook" ref="bookContainer">
        <div
          v-for="(page, index) in props.pages"
          :key="page.url || index"
          class="page"
          :data-density="densityFor(index)"
        >
          <div class="page-content">
            <div v-if="page.type === 'image'" class="image-container">
              <img :src="page.url" :alt="`${props.title || 'Page'} ${index + 1}`" draggable="false" />
            </div>
            <div v-else class="text-content">
              <h3 class="text-lg font-semibold">Page {{ index + 1 }}</h3>
              <p class="mt-2 text-sm text-gray-700">{{ page.content || '' }}</p>
              <span class="page-number">{{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="props.pages.length" class="flipbook-controls">
      <button
        type="button"
        class="nav-btn"
        :disabled="!canGoPrev"
        aria-label="Previous page"
        @click="goPrev"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="page-indicator">{{ pageLabel }}</span>
      <button
        type="button"
        class="nav-btn"
        :disabled="!canGoNext"
        aria-label="Next page"
        @click="goNext"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.flipbook-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.flipbook-stage {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* Closed book (front/back cover): single page centered on screen */
.flipbook-stage.is-front-cover :deep(.stf__parent),
.flipbook-stage.is-front-cover .flipbook {
  transform: translateX(-25%);
  transition: transform 0.28s ease;
}

.flipbook-stage.is-back-cover :deep(.stf__parent),
.flipbook-stage.is-back-cover .flipbook {
  transform: translateX(25%);
  transition: transform 0.28s ease;
}

.flipbook-stage:not(.is-closed) :deep(.stf__parent),
.flipbook-stage:not(.is-closed) .flipbook {
  transform: translateX(0);
  transition: transform 0.28s ease;
}

.flipbook-stage.is-closed :deep(.stf__item) {
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.18);
}

.page {
  background-color: #fff;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.12);
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
  box-sizing: border-box;
  padding: 0;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}

.text-content {
  padding: 16px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.page-number {
  position: absolute;
  bottom: 10px;
  right: 12px;
  font-size: 12px;
  color: rgba(100, 116, 139, 0.9);
  user-select: none;
}

.flipbook-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  user-select: none;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  border: 1px solid rgba(26, 54, 93, 0.15);
  background: #fff;
  color: #1a365d;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
}

.nav-btn:hover:not(:disabled) {
  background: #1a365d;
  color: #fff;
  border-color: #1a365d;
}

.nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.page-indicator {
  min-width: 4.5rem;
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #1a365d;
}
</style>
