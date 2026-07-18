<script setup>
import { computed } from 'vue';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});

const alignClass = computed(
  () =>
    ({
      left: 'text-left',
      center: 'text-center mx-auto',
      right: 'text-right ml-auto',
    })[props.data.align ?? 'left']
);
</script>

<template>
  <section
    :class="blockWrapperClass(data, 'px-4 py-10')"
    :style="blockInlineStyle(data)"
  >
    <div :class="cn('max-w-3xl', alignClass)">
      <h2
        v-if="data.title"
        class="mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
      >
        {{ data.title }}
      </h2>
      <div class="whitespace-pre-line text-base leading-relaxed text-slate-600">
        {{ data.content }}
      </div>
    </div>
  </section>
</template>
