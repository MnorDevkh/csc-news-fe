<script setup>
import { computed } from 'vue';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';
import SectionRenderer from '../renderer/SectionRenderer.vue';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  children: { type: Array, default: () => [] },
});

const spanMap = {
  1: 'md:w-1/12',
  2: 'md:w-2/12',
  3: 'md:w-3/12',
  4: 'md:w-4/12',
  5: 'md:w-5/12',
  6: 'md:w-6/12',
  7: 'md:w-7/12',
  8: 'md:w-8/12',
  9: 'md:w-9/12',
  10: 'md:w-10/12',
  11: 'md:w-11/12',
  12: 'md:w-full',
};

const span = computed(() => props.data?.spanMd ?? props.data?.span ?? 6);
const nested = computed(() => props.children ?? props.data?.children ?? []);
</script>

<template>
  <div
    :class="blockWrapperClass(data, cn('w-full min-w-0', spanMap[span]))"
    :style="blockInlineStyle(data)"
  >
    <SectionRenderer
      v-for="(child, i) in nested"
      :key="child.id || `${child.type}-${i}`"
      :section="child"
    />
  </div>
</template>
