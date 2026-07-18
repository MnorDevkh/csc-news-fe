<script setup>
import { computed, ref } from 'vue';
import { blockCatalog } from '../blockCatalog';

const emit = defineEmits(['close', 'pick-block', 'pick-layout']);

const query = ref('');
const filteredBlocks = computed(() => {
  const value = query.value.trim().toLowerCase();
  if (!value) return blockCatalog;
  return blockCatalog.filter(
    (block) =>
      block.label.toLowerCase().includes(value) ||
      block.description.toLowerCase().includes(value)
  );
});
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-label="Add content"
    @click.self="emit('close')"
  >
    <div class="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Add content</h2>
          <p class="text-sm text-slate-500">Choose a layout or block.</p>
        </div>
        <button
          type="button"
          class="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Close"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>

      <div class="max-h-[calc(90vh-85px)] overflow-y-auto p-5">
        <h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Layouts</h3>
        <div class="grid gap-3 sm:grid-cols-3">
          <button
            v-for="columns in [1, 2, 3]"
            :key="columns"
            type="button"
            class="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
            @click="emit('pick-layout', columns)"
          >
            <div class="mb-3 flex h-12 gap-1.5 rounded-lg bg-slate-100 p-2">
              <span
                v-for="column in columns"
                :key="column"
                class="h-full flex-1 rounded bg-slate-300 group-hover:bg-blue-300"
              />
            </div>
            <span class="font-semibold text-slate-900">
              {{ columns }} column{{ columns > 1 ? 's' : '' }}
            </span>
          </button>
        </div>

        <div class="mt-7 flex items-center justify-between gap-4">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">Blocks</h3>
          <input
            v-model="query"
            type="search"
            placeholder="Search blocks…"
            class="w-56 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="block in filteredBlocks"
            :key="block.type"
            type="button"
            class="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
            @click="emit('pick-block', block.type)"
          >
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700"
            >
              {{ block.icon }}
            </span>
            <span>
              <strong class="block text-sm text-slate-900">{{ block.label }}</strong>
              <span class="mt-0.5 block text-xs leading-5 text-slate-500">{{ block.description }}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
