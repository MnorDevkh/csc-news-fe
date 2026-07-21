<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import Flipbook from '@/components/Flipbook.vue';

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'The Messenger',
  },
});

const pages = ref([]);
const isLoading = ref(false);
const progress = ref({ current: 0, total: 0 });
const error = ref('');

const objectUrls = [];
let activeRenderToken = 0;
let activeLoadingTask = null;

function cleanupObjectUrls() {
  for (const url of objectUrls) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }
  objectUrls.length = 0;
}

async function canvasToObjectUrl(canvas) {
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.92));
  if (!blob) throw new Error('Failed to convert PDF page to image.');
  const url = URL.createObjectURL(blob);
  objectUrls.push(url);
  return url;
}

function getScale() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  return 1.35 * dpr;
}

async function cancelActiveLoad() {
  activeRenderToken++;
  if (activeLoadingTask) {
    try {
      await activeLoadingTask.destroy();
    } catch {
      // ignore
    }
    activeLoadingTask = null;
  }
}

async function renderPdfToPages(pdfUrl) {
  await cancelActiveLoad();
  const token = activeRenderToken;

  error.value = '';
  isLoading.value = true;
  pages.value = [];
  progress.value = { current: 0, total: 0 };
  cleanupObjectUrls();

  try {
    // Stream from S3 via range requests instead of waiting for the full object.
    const loadingTask = pdfjsLib.getDocument({
      url: pdfUrl,
      disableStream: false,
      disableAutoFetch: false,
      disableRange: false,
      rangeChunkSize: 65536,
    });
    activeLoadingTask = loadingTask;

    const pdf = await loadingTask.promise;
    if (token !== activeRenderToken) return;

    const total = pdf.numPages || 0;
    progress.value = { current: 0, total };

    const scale = getScale();
    for (let pageNumber = 1; pageNumber <= total; pageNumber++) {
      if (token !== activeRenderToken) return;

      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('Canvas is not supported in this browser.');

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({ canvasContext: ctx, viewport }).promise;
      if (token !== activeRenderToken) return;

      const url = await canvasToObjectUrl(canvas);
      if (token !== activeRenderToken) return;

      // Open flipbook as soon as the first page is ready; keep appending the rest.
      pages.value.push({ type: 'image', url });
      progress.value = { current: pageNumber, total };

      if (pageNumber % 2 === 0) await new Promise((r) => setTimeout(r, 0));
    }
  } catch (e) {
    if (token !== activeRenderToken) return;
    console.error('Failed to render PDF for flipbook:', e);
    error.value =
      e?.message ||
      'Failed to load PDF. If this is a cross-origin URL, ensure it allows CORS for pdf.js.';
  } finally {
    if (token === activeRenderToken) {
      isLoading.value = false;
      activeLoadingTask = null;
    }
  }
}

const hasPdf = computed(() => !!props.pdfUrl);
const showViewer = computed(() => pages.value.length > 0 && !error.value);

watch(
  () => props.pdfUrl,
  (url) => {
    if (!url) return;
    renderPdfToPages(url);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  cancelActiveLoad();
  cleanupObjectUrls();
});
</script>

<template>
  <section class="w-full">
    <div v-if="!hasPdf" class="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-600">
      PDF not available.
    </div>

    <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-100 flex items-center justify-between gap-2 sm:gap-3">
        <div class="min-w-0">
          <div class="text-sm font-semibold text-gray-900 truncate">{{ props.title }}</div>
          <div v-if="isLoading" class="text-xs text-gray-500">
            <span v-if="progress.total">
              Loading pages… {{ progress.current }}/{{ progress.total }}
            </span>
            <span v-else>Opening PDF…</span>
          </div>
        </div>
        <button
          v-if="error"
          type="button"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium"
          @click="renderPdfToPages(props.pdfUrl)"
        >
          Retry
        </button>
      </div>

      <div v-if="error" class="p-6 text-sm text-red-700 bg-red-50 border-t border-red-100">
        {{ error }}
      </div>

      <div v-else-if="!showViewer" class="p-6 sm:p-10 flex items-center justify-center">
        <div class="text-sm text-gray-500">Opening PDF…</div>
      </div>

      <div v-else class="p-4 sm:p-6 bg-gray-50">
        <div class="w-full flex justify-center">
          <div class="max-w-5xl w-full h-[70vh] min-h-[520px] flex items-center justify-center">
            <Flipbook :pages="pages" :title="props.title" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
