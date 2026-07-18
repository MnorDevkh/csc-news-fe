<script setup>
import { computed } from 'vue';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';
import SectionRenderer from '../renderer/SectionRenderer.vue';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  children: { type: Array, default: () => [] },
});

const alignClass = computed(
  () =>
    ({
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    })[props.data?.align ?? 'stretch']
);

const justifyClass = computed(
  () =>
    ({
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    })[props.data?.justify ?? 'start']
);

const nested = computed(() => props.children ?? props.data?.children ?? []);
</script>

<template>
  <div
    :class="blockWrapperClass(data, cn('flex flex-col gap-6 md:flex-row', alignClass, justifyClass))"
    :style="{
      ...blockInlineStyle(data),
      gap: data?.gap,
    }"
  >
    <SectionRenderer
      v-for="(child, i) in nested"
      :key="child.id || `${child.type}-${i}`"
      :section="child"
    />
  </div>
</template>
