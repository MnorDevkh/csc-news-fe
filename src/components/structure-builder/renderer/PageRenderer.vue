<script setup>
import SectionRenderer from './SectionRenderer.vue';

defineProps({
  sections: { type: Array, default: () => [] },
  compact: { type: Boolean, default: false },
});
</script>

<template>
  <div class="structure-page-renderer" :class="{ 'structure-page-renderer--compact': compact }">
    <SectionRenderer
      v-for="(section, index) in sections"
      :key="section.id || `${section.type}-${index}`"
      :section="section"
    />
    <div
      v-if="!sections.length"
      class="px-4 py-10 text-center text-sm text-slate-500"
    >
      No content yet.
    </div>
  </div>
</template>

<style>
@keyframes sb-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes sb-slide-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes sb-slide-left {
  from { opacity: 0; transform: translateX(12px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes sb-slide-right {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}
.sb-animate-fade-in { animation: sb-fade-in 0.45s ease-out both; }
.sb-animate-slide-up { animation: sb-slide-up 0.45s ease-out both; }
.sb-animate-slide-left { animation: sb-slide-left 0.45s ease-out both; }
.sb-animate-slide-right { animation: sb-slide-right 0.45s ease-out both; }

.structure-page-renderer--compact .px-4 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.structure-page-renderer--compact .py-12,
.structure-page-renderer--compact .py-14,
.structure-page-renderer--compact .py-10 {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}
</style>
