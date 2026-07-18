<script setup>
import { computed } from 'vue';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});

const alignClass = computed(
  () =>
    ({
      left: 'text-left',
      center: 'text-center mx-auto',
      right: 'text-right ml-auto',
    })[props.data.align ?? 'left']
);
</script>

<template>
  <section
    :class="blockWrapperClass(data, 'px-4 py-8')"
    :style="blockInlineStyle(data)"
  >
    <div
      :class="cn(
        'article-body ck-content prose prose-gray prose-lg max-w-3xl',
        alignClass
      )"
      v-html="data.html || ''"
    />
  </section>
</template>

<style scoped>
.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3) {
  font-weight: 700;
  color: #111827;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
.article-body :deep(p) {
  color: #374151;
  line-height: 1.625;
  margin-bottom: 1rem;
}
.article-body :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}
</style>
