<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});

const position = computed(() => {
  const v = props.data.imagePosition;
  if (v === 'right' || v === 'top' || v === 'bottom') return v;
  return 'left';
});

const isStacked = computed(() => position.value === 'top' || position.value === 'bottom');

const fit = computed(() => {
  const v = props.data.objectFit;
  if (v === 'contain' || v === 'natural') return v;
  return 'cover';
});

const imageClass = computed(() =>
  cn(
    'rounded-2xl bg-slate-100',
    fit.value === 'natural' && 'mx-auto h-auto w-auto max-w-full',
    fit.value === 'cover' && 'aspect-[4/3] w-full object-cover',
    fit.value === 'contain' && 'aspect-[4/3] w-full object-contain'
  )
);

const imagePlaceholderClass = computed(() =>
  cn(
    'w-full rounded-2xl bg-slate-100',
    fit.value === 'natural' && 'min-h-[12rem]',
    fit.value !== 'natural' && 'aspect-[4/3]'
  )
);

const layoutClass = computed(() => {
  if (isStacked.value) {
    return cn(
      'mx-auto grid max-w-6xl items-start gap-8 grid-cols-1',
      position.value === 'bottom' && '[&>*:first-child]:order-2'
    );
  }
  return cn(
    'mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2',
    position.value === 'right' && '[&>*:first-child]:lg:order-2'
  );
});

function isExternal(link) {
  return /^https?:\/\//.test(link || '');
}
</script>

<template>
  <section
    :class="blockWrapperClass(data, 'px-4 py-12')"
    :style="blockInlineStyle(data)"
  >
    <div :class="layoutClass">
      <img
        v-if="data.image"
        :src="data.image"
        :alt="data.imageAlt || data.title || ''"
        :class="imageClass"
      />
      <div v-else :class="imagePlaceholderClass" />

      <div>
        <h2
          v-if="data.title"
          class="mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          {{ data.title }}
        </h2>
        <div
          v-if="data.html"
          class="article-body ck-content prose prose-gray max-w-none text-slate-600"
          v-html="data.html"
        />
        <p
          v-else-if="data.content"
          class="whitespace-pre-line text-base leading-relaxed text-slate-600"
        >
          {{ data.content }}
        </p>
        <a
          v-if="data.buttonText && data.buttonLink && isExternal(data.buttonLink)"
          :href="data.buttonLink"
          class="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ data.buttonText }}
        </a>
        <RouterLink
          v-else-if="data.buttonText && data.buttonLink"
          :to="data.buttonLink"
          class="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          {{ data.buttonText }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>
