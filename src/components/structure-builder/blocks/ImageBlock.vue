<script setup>
import { computed } from 'vue';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});

const fit = computed(() => {
  const v = props.data.objectFit;
  if (v === 'contain' || v === 'natural') return v;
  return 'cover';
});

const imageClass = computed(() =>
  cn(
    'mx-auto bg-slate-100',
    props.data.rounded !== false && 'rounded-2xl',
    fit.value === 'natural' && 'h-auto w-auto max-w-full',
    fit.value === 'cover' && 'aspect-video w-full max-w-4xl object-cover',
    fit.value === 'contain' && 'aspect-video w-full max-w-4xl object-contain'
  )
);
</script>

<template>
  <figure
    :class="blockWrapperClass(data, 'px-4 py-8')"
    :style="blockInlineStyle(data)"
  >
    <img
      v-if="data.src"
      :src="data.src"
      :alt="data.alt || data.caption || ''"
      :class="imageClass"
    />
    <figcaption
      v-if="data.caption"
      class="mt-3 text-center text-sm text-slate-500"
    >
      {{ data.caption }}
    </figcaption>
  </figure>
</template>
