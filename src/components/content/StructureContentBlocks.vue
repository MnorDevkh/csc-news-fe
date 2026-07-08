<script setup>
defineProps({
  blocks: {
    type: Array,
    required: true,
  },
  pageTitle: {
    type: String,
    default: '',
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

function stripHtml(v) {
  if (!v) return '';
  return String(v).replace(/<[^>]*>/g, '').trim();
}

function safeColumns(raw) {
  const n = typeof raw === 'number' && Number.isFinite(raw) ? Math.trunc(raw) : 3;
  return Math.min(6, Math.max(1, n));
}

function gridColsClass(columns) {
  const c = safeColumns(columns);
  return {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }[c];
}

function textImageFigureClass(ratio) {
  if (ratio === '2/3') return 'xl:w-2/3';
  if (ratio === '1/2') return 'xl:w-1/2';
  return 'xl:w-1/3';
}

function textImageTextClass(block) {
  if (!block.image?.url) return '';
  if (block.ratio === '2/3') return 'xl:w-1/3';
  if (block.ratio === '1/2') return 'xl:w-1/2';
  return 'xl:w-2/3';
}
</script>

<template>
  <div class="structure-content-blocks" :class="compact ? 'structure-content-blocks--compact' : ''">
    <div
      v-for="(block, index) in blocks"
      :key="block.id || index"
      class="article-body-block"
      :class="compact ? 'mb-5 last:mb-0' : 'mb-8 sm:mb-10 last:mb-0'"
    >
      <div
        v-if="block.type === 'text_image'"
        class="article-body-text-image rounded-xl border border-gray-100 bg-gray-50/60 p-4 sm:p-6"
      >
        <div
          class="flex flex-col gap-5"
          :class="
            block.layout === 'left'
              ? 'xl:flex-row'
              : block.layout === 'right'
                ? 'xl:flex-row-reverse'
                : ''
          "
        >
          <figure
            v-if="block.image && block.image.url"
            class="m-0 w-full xl:flex-shrink-0"
            :class="textImageFigureClass(block.ratio)"
          >
            <img
              :src="block.image.url"
              :alt="stripHtml(block.caption) || pageTitle + ' image'"
              class="rounded-md w-full h-auto max-h-[480px] object-contain mx-auto bg-gray-50 border border-gray-100"
            />
            <figcaption
              v-if="block.caption && String(block.caption).trim()"
              class="mt-2 text-sm text-gray-500 font-light leading-snug text-center xl:text-left"
            >
              <div class="ck-content" v-html="block.caption" />
            </figcaption>
          </figure>
          <div class="w-full" :class="textImageTextClass(block)">
            <div
              v-if="block.html"
              class="article-body ck-content prose prose-gray prose-lg max-w-none"
              v-html="block.html"
            />
          </div>
        </div>
      </div>

      <div
        v-else-if="block.type === 'text' && block.html"
        class="article-body ck-content prose prose-gray prose-lg max-w-none"
        v-html="block.html"
      />

      <div
        v-else-if="block.type === 'image' && block.images && block.images.length"
        class="article-body-images my-6"
      >
        <div class="grid gap-4" :class="gridColsClass(block.columns)">
          <figure v-for="(img, i) in block.images" :key="img.key || i" class="m-0">
            <img
              :src="img.url"
              :alt="stripHtml(img.title) || pageTitle + ' image ' + (i + 1)"
              class="rounded-md w-full h-auto object-contain bg-gray-50 border border-gray-100"
            />
            <figcaption v-if="img.title && String(img.title).trim()" class="mt-2 text-center">
              <div class="ck-content text-sm text-gray-500 font-light leading-snug" v-html="img.title" />
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4),
.article-body :deep(h5),
.article-body :deep(h6) {
  font-weight: 700;
  color: #111827;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.article-body :deep(h1) {
  font-size: 1.5rem;
  line-height: 2rem;
}

.article-body :deep(h2) {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.article-body :deep(h3) {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.article-body :deep(h4) {
  font-size: 1rem;
  line-height: 1.5rem;
}

.article-body :deep(h5),
.article-body :deep(h6) {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.article-body :deep(p) {
  color: #374151;
  line-height: 1.625;
  margin-bottom: 1rem;
}

.article-body :deep(a) {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.article-body :deep(a:hover) {
  color: #1d4ed8;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.article-body :deep(ul) {
  list-style-type: disc;
}

.article-body :deep(ol) {
  list-style-type: decimal;
}

.article-body :deep(li) {
  margin-bottom: 0.25rem;
  color: #374151;
}

.article-body :deep(blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  font-style: italic;
  color: #4b5563;
}

.article-body :deep(img) {
  border-radius: 0.5rem;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  max-width: 100%;
  height: auto;
}

.article-body :deep([style*='text-align: center']),
.article-body :deep([style*='text-align:center']) {
  text-align: center;
}

.article-body :deep([style*='text-align: right']),
.article-body :deep([style*='text-align:right']) {
  text-align: right;
}

.article-body :deep([style*='text-align: justify']),
.article-body :deep([style*='text-align:justify']) {
  text-align: justify;
}

.ck-content :deep(p) {
  margin: 0;
}

.ck-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.ck-content :deep(a:hover) {
  color: #1d4ed8;
}

.article-body-block + .article-body-block {
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.structure-content-blocks--compact .article-body-block + .article-body-block {
  padding-top: 1rem;
}
</style>
