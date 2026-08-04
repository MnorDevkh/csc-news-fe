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
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    })[props.data.align ?? 'center']
);

const btnClass = computed(() => {
  const sizeClass = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }[props.data.size ?? 'md'];

  const variantClass = {
    primary:
      'bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/15 active:scale-[0.98]',
    secondary:
      'bg-accent text-white hover:bg-accent-hover shadow-sm shadow-accent/20 active:scale-[0.98]',
    outline:
      'border border-primary/30 text-primary hover:bg-primary-light hover:border-primary',
    ghost: 'text-primary hover:bg-primary-light',
  }[props.data.variant ?? 'primary'];

  return cn(
    'inline-flex items-center rounded-[var(--radius-button)] font-semibold transition-all duration-200',
    sizeClass,
    variantClass
  );
});

const isExternal = computed(() => /^https?:\/\//.test(props.data.link || ''));
</script>

<template>
  <div
    :class="blockWrapperClass(data, cn('flex px-4 py-4', alignClass))"
    :style="blockInlineStyle(data)"
  >
    <a
      v-if="isExternal && data.link"
      :href="data.link"
      :class="btnClass"
      :target="data.openInNewTab ? '_blank' : undefined"
      :rel="data.openInNewTab ? 'noopener noreferrer' : undefined"
    >
      {{ data.text }}
    </a>
    <RouterLink v-else-if="data.link" :to="data.link" :class="btnClass">
      {{ data.text }}
    </RouterLink>
    <button v-else type="button" :class="btnClass">
      {{ data.text }}
    </button>
  </div>
</template>
