<script setup>
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';

defineProps({
  data: { type: Object, default: () => ({}) },
});
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
      :class="cn(
        'mx-auto w-full max-w-4xl object-cover',
        data.rounded !== false && 'rounded-2xl',
        data.objectFit === 'contain' && 'object-contain',
        data.objectFit === 'fill' && 'object-fill',
        'aspect-video bg-slate-100'
      )"
    />
    <figcaption
      v-if="data.caption"
      class="mt-3 text-center text-sm text-slate-500"
    >
      {{ data.caption }}
    </figcaption>
  </figure>
</template>
