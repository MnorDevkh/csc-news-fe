<script setup>
import { ref } from 'vue';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});

const openSet = ref(new Set([0]));

function isOpen(i) {
  return openSet.value.has(i);
}

function toggle(i) {
  const next = new Set(openSet.value);
  if (next.has(i)) {
    next.delete(i);
  } else {
    if (!props.data.allowMultiple) next.clear();
    next.add(i);
  }
  openSet.value = next;
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

      <div class="space-y-3">
        <div
          v-for="(item, i) in data.items || []"
          :key="i"
          class="overflow-hidden rounded-xl border border-slate-200"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-4 bg-slate-50 px-5 py-4 text-left"
            :aria-expanded="isOpen(i)"
            @click="toggle(i)"
          >
            <span class="font-medium text-slate-900">{{ item.title }}</span>
            <span
              :class="cn(
                'shrink-0 text-blue-600 transition-transform duration-200',
                isOpen(i) && 'rotate-45'
              )"
              aria-hidden="true"
            >
              +
            </span>
          </button>
          <div
            v-show="isOpen(i)"
            class="border-t border-slate-200 px-5 py-4 text-sm leading-relaxed text-slate-600"
          >
            {{ item.content }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
