<script setup>
import { computed, ref } from 'vue';
import ConfigEditor from './ConfigEditor.vue';
import { getBlockDefinition } from '../blockCatalog';

const props = defineProps({
  section: { type: Object, required: true },
  index: { type: Number, required: true },
  total: { type: Number, required: true },
  depth: { type: Number, default: 0 },
});

const emit = defineEmits(['remove', 'move-up', 'move-down', 'add-to']);

const expanded = ref(true);
const definition = computed(() => getBlockDefinition(props.section.type));
const isLayout = computed(() => ['container', 'row', 'column'].includes(props.section.type));
const label = computed(() => {
  if (definition.value) return definition.value.label;
  if (props.section.type === 'container') return 'Container';
  if (props.section.type === 'row') return 'Row';
  if (props.section.type === 'column') return 'Column';
  return props.section.type;
});

if (!props.section.config || typeof props.section.config !== 'object') {
  props.section.config = {};
}

function children() {
  if (!props.section.children) props.section.children = [];
  return props.section.children;
}

function removeChild(index) {
  children().splice(index, 1);
}

function moveChild(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= children().length) return;
  const [item] = children().splice(index, 1);
  if (item) children().splice(target, 0, item);
}
</script>

<template>
  <article
    class="rounded-xl border bg-white shadow-sm"
    :class="isLayout ? 'border-blue-200' : 'border-slate-200'"
  >
    <header class="flex items-center gap-2 px-3 py-2.5">
      <button
        type="button"
        class="text-slate-400 hover:text-slate-700"
        :aria-label="expanded ? 'Collapse section' : 'Expand section'"
        @click="expanded = !expanded"
      >
        {{ expanded ? '▾' : '▸' }}
      </button>
      <span
        class="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold"
        :class="isLayout ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'"
      >
        {{ definition?.icon || (section.type === 'column' ? '▯' : '□') }}
      </span>
      <div class="min-w-0 flex-1">
        <strong class="block truncate text-sm text-slate-900">{{ label }}</strong>
        <span class="block truncate text-[11px] text-slate-400">{{ section.type }}</span>
      </div>
      <button
        type="button"
        class="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-25"
        :disabled="index === 0"
        aria-label="Move up"
        @click="emit('move-up')"
      >
        ↑
      </button>
      <button
        type="button"
        class="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-25"
        :disabled="index === total - 1"
        aria-label="Move down"
        @click="emit('move-down')"
      >
        ↓
      </button>
      <button
        type="button"
        class="rounded p-1 text-red-500 hover:bg-red-50"
        aria-label="Delete section"
        @click="emit('remove')"
      >
        ✕
      </button>
    </header>

    <div v-if="expanded" class="border-t border-slate-100 p-3">
      <ConfigEditor v-if="!isLayout" :section="section" />

      <div v-else>
        <div v-if="section.type === 'container'" class="mb-3 grid gap-3 sm:grid-cols-2">
          <label class="text-xs font-medium text-slate-600">
            Max width
            <select
              v-model="section.config.maxWidth"
              class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
            >
              <option value="lg">Large</option>
              <option value="xl">Extra large</option>
              <option value="2xl">2XL</option>
              <option value="full">Full width</option>
            </select>
          </label>
          <label class="text-xs font-medium text-slate-600">
            Padding
            <input
              v-model="section.config.padding"
              placeholder="2rem 0"
              class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
            />
          </label>
        </div>
        <div v-if="section.type === 'row'" class="mb-3">
          <label class="text-xs font-medium text-slate-600">
            Column gap
            <input
              v-model="section.config.gap"
              placeholder="1.5rem"
              class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
            />
          </label>
        </div>
        <div v-if="section.type === 'column'" class="mb-3">
          <label class="text-xs font-medium text-slate-600">
            Width
            <select
              v-model.number="section.config.span"
              class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
            >
              <option :value="3">25%</option>
              <option :value="4">33%</option>
              <option :value="6">50%</option>
              <option :value="8">66%</option>
              <option :value="9">75%</option>
              <option :value="12">100%</option>
            </select>
          </label>
        </div>

        <div
          class="space-y-3 rounded-lg border border-dashed p-2"
          :class="
            section.type === 'column'
              ? 'border-blue-300 bg-blue-50/50'
              : 'border-slate-300'
          "
        >
          <SectionBuilder
            v-for="(child, childIndex) in children()"
            :key="child.id || childIndex"
            :section="child"
            :index="childIndex"
            :total="children().length"
            :depth="depth + 1"
            @remove="removeChild(childIndex)"
            @move-up="moveChild(childIndex, -1)"
            @move-down="moveChild(childIndex, 1)"
            @add-to="emit('add-to', $event)"
          />

          <button
            v-if="section.type === 'column' || section.type === 'container'"
            type="button"
            class="w-full rounded-lg border border-dashed border-blue-400 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
            @click="emit('add-to', children())"
          >
            + Add block here
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
