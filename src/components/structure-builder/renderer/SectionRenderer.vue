<script setup>
import { computed } from 'vue';
import { componentMap, hasComponent } from '../utils/componentMap';

const props = defineProps({
  section: { type: Object, required: true },
});

const resolved = computed(() => {
  if (!hasComponent(props.section.type)) return null;
  return componentMap[props.section.type];
});
</script>

<template>
  <component
    :is="resolved"
    v-if="resolved"
    :data="section.config || {}"
    :children="section.children"
  />
  <div
    v-else
    class="mx-4 my-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800"
    role="status"
  >
    Unknown block type: <code class="font-mono">{{ section.type }}</code>
  </div>
</template>
