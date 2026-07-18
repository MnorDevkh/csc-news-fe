<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
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

function isExternal(link) {
  return /^https?:\/\//.test(link || '');
}
</script>

<template>
  <section
    :class="blockWrapperClass(data, 'px-4 py-12')"
    :style="blockInlineStyle(data)"
  >
    <div class="mx-auto max-w-6xl">
      <div v-if="data.title || data.subtitle" class="mb-10 text-center">
        <h2
          v-if="data.title"
          class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          {{ data.title }}
        </h2>
        <p v-if="data.subtitle" class="mt-2 text-slate-600">
          {{ data.subtitle }}
        </p>
      </div>

      <div :class="cn('grid gap-6', cols)">
        <article
          v-for="(card, i) in data.cards || []"
          :key="i"
          class="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <img
            v-if="card.image"
            :src="card.image"
            :alt="card.title"
            class="aspect-video w-full object-cover bg-slate-100"
          />
          <div class="flex flex-1 flex-col p-5">
            <div v-if="card.icon" class="mb-2 text-2xl" aria-hidden="true">{{ card.icon }}</div>
            <h3 class="text-lg font-semibold text-slate-900">{{ card.title }}</h3>
            <p
              v-if="card.description"
              class="mt-2 flex-1 text-sm leading-relaxed text-slate-600"
            >
              {{ card.description }}
            </p>
            <a
              v-if="card.link && isExternal(card.link)"
              :href="card.link"
              class="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more →
            </a>
            <RouterLink
              v-else-if="card.link"
              :to="card.link"
              class="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-500"
            >
              Learn more →
            </RouterLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
