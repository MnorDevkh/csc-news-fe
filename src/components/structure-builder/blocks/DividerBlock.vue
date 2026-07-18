<script setup>
import { computed } from 'vue';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});

const styleClass = computed(
  () =>
    ({
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    })[props.data.style ?? 'solid']
);
</script>

<template>
  <div
    :class="blockWrapperClass(data, 'flex justify-center px-4 py-6')"
    :style="blockInlineStyle(data)"
  >
    <hr
      :class="cn('border-t border-slate-200', styleClass)"
      :style="{
        width: data.width || '100%',
        maxWidth: '64rem',
        borderTopWidth: data.thickness || '1px',
        borderColor: data.color,
      }"
    />
  </div>
</template>
