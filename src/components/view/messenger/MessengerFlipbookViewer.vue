<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Flipbook from '@/components/Flipbook.vue';

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const { t } = useI18n();

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
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

      pages.value.push({ type: 'image', url });
      progress.value = { current: pageNumber, total };

      if (pageNumber % 2 === 0) await new Promise((r) => setTimeout(r, 0));
    }
  } catch (e) {
    if (token !== activeRenderToken) return;
    console.error('Failed to render PDF for flipbook:', e);
    error.value =
      e?.message ||
      t('messenger.pdfLoadFailed');
  } finally {
    if (token === activeRenderToken) {
      isLoading.value = false;
      activeLoadingTask = null;
    }
  }
}

const hasPdf = computed(() => !!props.pdfUrl);
const showViewer = computed(() => pages.value.length > 0 && !error.value);
const progressPct = computed(() => {
  if (!progress.value.total) return 8;
  return Math.round((progress.value.current / progress.value.total) * 100);
});

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
    <div
      v-if="!hasPdf"
      class="rounded-2xl border border-dashed border-primary/20 bg-white px-5 py-10 text-center text-sm text-muted"
    >
      {{ t('messenger.pdfUnavailable') }}
    </div>

    <div v-else class="overflow-hidden rounded-2xl border border-primary/8 bg-white/80 shadow-[0_20px_60px_-28px_rgba(65, 101, 209,0.35)] backdrop-blur-sm">
      <div class="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div class="min-w-0 text-xs text-muted">
          <span v-if="isLoading && progress.total">
            {{ t('messenger.loadingProgress', { current: progress.current, total: progress.total }) }}
          </span>
          <span v-else-if="isLoading">{{ t('messenger.openingPdf') }}</span>
          <span v-else>{{ t('messenger.flipbook') }}</span>
        </div>

        <div class="flex items-center gap-2">
          <a
            v-if="props.pdfUrl"
            :href="props.pdfUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center rounded-full border border-primary/15 bg-primary px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
          >
            {{ t('messenger.openPdf') }}
          </a>
          <button
            v-if="error"
            type="button"
            class="text-sm font-medium text-primary hover:text-primary-hover"
            @click="renderPdfToPages(props.pdfUrl)"
          >
            {{ t('common.retry') }}
          </button>
        </div>
      </div>

      <div
        v-if="isLoading"
        class="h-0.5 w-full overflow-hidden bg-primary-light"
        aria-hidden="true"
      >
        <div
          class="h-full bg-accent transition-[width] duration-300 ease-out"
          :style="{ width: `${progressPct}%` }"
        />
      </div>

      <div v-if="error" class="border-t border-red-100 bg-red-50 p-6 text-sm text-red-700">
        {{ error }}
      </div>

      <div
        v-else-if="!showViewer"
        class="flex min-h-[280px] flex-col items-center justify-center gap-3 bg-surface p-8 sm:min-h-[420px]"
      >
        <div
          class="h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
          aria-hidden="true"
        />
        <div class="text-sm text-muted">{{ t('messenger.preparingMagazine') }}</div>
      </div>

      <div
        v-else
        class="flex min-h-[min(72vh,820px)] items-center justify-center bg-[radial-gradient(ellipse_at_center,_#f8fafc_0%,_#e9eefb_70%)] p-3 sm:p-6"
      >
        <div class="mx-auto flex h-[min(72vh,820px)] min-h-[420px] w-full max-w-5xl items-center justify-center">
          <Flipbook :pages="pages" :title="props.title || t('messenger.title')" :show-cover="true" />
        </div>
      </div>
    </div>
  </section>
</template>
