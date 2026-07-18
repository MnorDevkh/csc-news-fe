<script setup>
import { computed } from 'vue';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';
import SectionRenderer from '../renderer/SectionRenderer.vue';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  children: { type: Array, default: () => [] },
});

const maxWidthClass = computed(
  () =>
    ({
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-none',
    })[props.data?.maxWidth ?? 'xl']
);

const nested = computed(() => props.children ?? props.data?.children ?? []);
</script>

<template>
  <div
    :class="blockWrapperClass(data, cn('mx-auto w-full px-4', maxWidthClass))"
    :style="blockInlineStyle(data)"
  >
    <SectionRenderer
      v-for="(child, i) in nested"
      :key="child.id || `${child.type}-${i}`"
      :section="child"
    />
  </div>
</template>
