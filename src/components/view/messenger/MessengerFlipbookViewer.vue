<template>
  <!-- Fallback to basic iframe until flipbook props are wired -->
  <!-- <div v-if="!bookId || !totalPages" class="pdf-container">
    <iframe
      v-if="pdfUrl"
      :src="pdfUrl"
      :style="{ width: '100%', height }"
      frameborder="0"
    />
    <div v-else class="pdf-fallback">
      No PDF available.
    </div>
  </div> -->

  <!-- Image-based flipbook (Heyzine-style) -->
  <div
 ref="containerRef"
    class="pdf-flipbook"
    :style="{ height }"
  >
    <div
      ref="bookRef"
      class="book-container"
      :class="alignmentClass"
    />
  </div>
</template>

<script setup>
/**
 * Image-based flipbook: each page is fetched independently as a server-rendered
 * image via a page-image endpoint. This avoids embedding the full PDF viewer
 * while giving a Heyzine-like flip experience.
 *
 * NOTE: You must provide a `bookId` (or issue id) and `totalPages`, and ensure
 *       your backend exposes a page-image URL for each page. Adjust
 *       `buildPageImageUrl` below to match your API.
 */
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { PageFlip } from 'page-flip'

const props = defineProps({
  pdfUrl: { type: String, required: true },
  height: { type: String, default: '600px' },
  // Identifier used by the backend to resolve page images (e.g. issue id)
  bookId: { type: String, required: false },
  // Total number of pages available for flipbook mode
  totalPages: { type: Number, default: 0 },
})

const containerRef = ref(null)
const bookRef = ref(null)
const alignmentClass = ref('align-cover')

let pageFlip = null
let pageElements = []
let destroyed = false
const loadedPages = new Set()
const PREFETCH_BATCH = 3

const PAGE_WIDTH = 400
const PAGE_HEIGHT = 566

function buildPageImageUrl(bookId, pageNum) {
  // TODO: Adjust this to your real backend endpoint.
  // Example pattern: `/api/v1/messenger-issues/${bookId}/pages/${pageNum}`
  const encodedId = encodeURIComponent(bookId)
  return `/api/v1/messenger-issues/${encodedId}/pages/${pageNum}`
}

function createPageElements() {
  if (!bookRef.value) return
  bookRef.value.innerHTML = ''
  pageElements = []

  for (let i = 0; i < props.totalPages; i++) {
    const div = document.createElement('div')
    div.className = 'page'
    div.dataset.page = String(i + 1)
    div.style.width = `${PAGE_WIDTH}px`
    div.style.height = `${PAGE_HEIGHT}px`
    div.style.backgroundColor = '#fff'
    div.style.display = 'flex'
    div.style.alignItems = 'center'
    div.style.justifyContent = 'center'

    const spinner = document.createElement('div')
    spinner.className = 'page-spinner'
    div.appendChild(spinner)

    bookRef.value.appendChild(div)
    pageElements.push(div)
  }
}

function loadPage(pageNum) {
  if (!props.bookId) return

  const el = pageElements[pageNum - 1]
  if (!el || loadedPages.has(pageNum) || destroyed) return
  loadedPages.add(pageNum)

  return new Promise((resolve) => {
    const img = new Image()
    img.style.maxWidth = '100%'
    img.style.maxHeight = '100%'
    img.style.objectFit = 'contain'

    img.onload = () => {
      if (!destroyed) {
        el.innerHTML = ''
        el.appendChild(img)
      }
      resolve()
    }

    img.onerror = () => {
      loadedPages.delete(pageNum)
      resolve()
    }

    img.src = buildPageImageUrl(props.bookId, pageNum)
  })
}

async function prefetchAll() {
  for (let i = 1; i <= props.totalPages; i += PREFETCH_BATCH) {
    if (destroyed) return
    const batch = []
    for (let j = i; j < i + PREFETCH_BATCH && j <= props.totalPages; j++) {
      batch.push(loadPage(j))
    }
    await Promise.all(batch)
  }
}

function initPageFlip() {
  if (!bookRef.value || pageFlip) return
  pageFlip = new PageFlip(bookRef.value, {
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    size: 'stretch',
    minWidth: 300,
    maxWidth: 500,
    minHeight: 424,
    maxHeight: 707,
    showCover: true,
    usePortrait: true,
    startPage: 0,
    flippingTime: 600,
  })
  pageFlip.loadFromHTML(bookRef.value.querySelectorAll('.page'))

  const isBackCover = props.totalPages % 2 === 0
  pageFlip.on('flip', (e) => {
    const pageIndex = e.data
    const page = pageIndex + 1

    if (pageIndex === 0) {
      alignmentClass.value = 'align-cover'
    } else if (isBackCover && pageIndex >= props.totalPages - 1) {
      alignmentClass.value = 'align-back'
    } else {
      alignmentClass.value = ''
    }

    loadPage(page)
    if (page < props.totalPages) loadPage(page + 1)
    if (page > 1) loadPage(page - 1)
  })
}

function initFlipbook() {
  if (!containerRef.value || !bookRef.value || !props.bookId || !props.totalPages) return
  destroyed = false

  createPageElements()
  initPageFlip()

  prefetchAll()
}

function destroyFlipbook() {
  destroyed = true
  if (pageFlip) {
    pageFlip.destroy()
    pageFlip = null
  }
  pageElements = []
  loadedPages.clear()
}

onMounted(() => {
  initFlipbook()
})

onBeforeUnmount(() => {
  destroyFlipbook()
})

watch(
  () => [props.bookId, props.totalPages],
  () => {
    destroyFlipbook()
    initFlipbook()
  },
)
</script>

<style scoped>
.pdf-container {
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.pdf-fallback {
  padding: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.pdf-flipbook {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: flipbook-in 0.25s ease-out;
}

@keyframes flipbook-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.book-container {
  width: 100%;
  max-width: 900px;
  min-height: 500px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.book-container.align-cover {
  transform: translateX(-25%);
}

.book-container.align-back {
  transform: translateX(25%);
}

@media (max-width: 640px) {
  .book-container.align-cover,
  .book-container.align-back {
    transform: none;
  }
  .pdf-flipbook {
    padding: 0.5rem 0;
  }
}

.book-container :deep(.page) {
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.06);
  border-radius: 2px;
}

.book-container :deep(.page-spinner) {
  width: 28px;
  height: 28px;
  border: 2.5px solid #e2e8f0;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.book-container :deep(img) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
