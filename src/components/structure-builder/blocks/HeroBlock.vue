<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});

const alignClass = computed(
  () =>
    ({
      left: 'items-start text-left',
      center: 'items-center text-center',
      right: 'items-end text-right',
    })[props.data.align ?? 'center']
);

function isExternal(link) {
  return /^https?:\/\//.test(link || '');
}
</script>

<template>
  <section
    :class="blockWrapperClass(data, 'relative overflow-hidden')"
    :style="blockInlineStyle(data)"
  >
    <div
      class="relative flex min-h-[320px] w-full flex-col justify-center px-4 py-16 sm:min-h-[420px] sm:px-8"
      :style="{ minHeight: data.minHeight }"
    >
      <img
        v-if="data.image"
        :src="data.image"
        :alt="data.imageAlt || data.title || ''"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div
        v-if="data.overlay !== false && data.image"
        class="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/55 to-blue-950/40"
      />
      <div
        v-if="!data.image"
        class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900"
      />

      <div :class="cn('relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-4', alignClass)">
        <h1 class="text-3xl font-bold tracking-tight text-white sm:text-5xl">
          {{ data.title }}
        </h1>
        <p v-if="data.subtitle" class="max-w-2xl text-lg text-slate-200 sm:text-xl">
          {{ data.subtitle }}
        </p>
        <div v-if="data.buttonText && data.buttonLink" class="mt-4 flex flex-wrap gap-3">
          <a
            v-if="isExternal(data.buttonLink)"
            :href="data.buttonLink"
            class="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ data.buttonText }}
          </a>
          <RouterLink
            v-else
            :to="data.buttonLink"
            class="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500"
          >
            {{ data.buttonText }}
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
