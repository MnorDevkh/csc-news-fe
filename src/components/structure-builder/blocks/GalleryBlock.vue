<script setup>
import { computed } from 'vue';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});

const cols = computed(
  () =>
    ({
      2: 'sm:grid-cols-2',
      3: 'sm:grid-cols-2 lg:grid-cols-3',
      4: 'sm:grid-cols-2 lg:grid-cols-4',
    })[props.data.columns ?? 3]
);
</script>

<template>
  <section
    :class="blockWrapperClass(data, 'px-4 py-12')"
    :style="blockInlineStyle(data)"
  >
    <div class="mx-auto max-w-6xl">
      <h2
        v-if="data.title"
        class="mb-8 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
      >
        {{ data.title }}
      </h2>
      <div :class="cn('grid gap-4', cols)">
        <figure
          v-for="(img, i) in data.images || []"
          :key="i"
          class="group overflow-hidden rounded-xl"
        >
          <img
            v-if="img.src"
            :src="img.src"
            :alt="img.alt || img.caption || ''"
            class="aspect-square w-full object-cover transition duration-500 group-hover:scale-105 bg-slate-100"
          />
          <figcaption
            v-if="img.caption"
            class="mt-2 text-center text-sm text-slate-500"
          >
            <span v-if="String(img.caption).includes('<')" v-html="img.caption" />
            <template v-else>{{ img.caption }}</template>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
