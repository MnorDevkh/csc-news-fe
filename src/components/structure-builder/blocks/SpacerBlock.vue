<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});

const style = computed(() => ({
  '--spacer-mobile': props.data.heightMobile || props.data.height || '2rem',
  '--spacer-desktop': props.data.height || props.data.heightMobile || '2rem',
}));
</script>

<template>
  <div
    aria-hidden="true"
    class="w-full h-[var(--spacer-mobile)] md:h-[var(--spacer-desktop)]"
    :style="style"
  />
</template>
