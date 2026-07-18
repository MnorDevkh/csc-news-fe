<script setup>
import { ref } from 'vue';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';

defineProps({
  data: { type: Object, default: () => ({}) },
});

const openIndex = ref(0);

function toggle(i) {
  openIndex.value = openIndex.value === i ? null : i;
}
</script>

<template>
  <section
    :class="blockWrapperClass(data, 'px-4 py-12')"
    :style="blockInlineStyle(data)"
  >
    <div class="mx-auto max-w-3xl">
      <h2
        v-if="data.title"
        class="mb-8 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
      >
        {{ data.title }}
      </h2>

      <div class="divide-y divide-slate-200 rounded-2xl border border-slate-200">
        <div v-for="(item, i) in data.items || []" :key="i">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
            :aria-expanded="openIndex === i"
            @click="toggle(i)"
          >
            <span class="font-medium text-slate-900">{{ item.question }}</span>
            <span
              :class="cn(
                'shrink-0 text-slate-400 transition-transform duration-200',
                openIndex === i && 'rotate-180'
              )"
              aria-hidden="true"
            >
              ▾
            </span>
          </button>
          <div
            v-show="openIndex === i"
            class="px-5 pb-4 text-sm leading-relaxed text-slate-600"
          >
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
