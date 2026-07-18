<script setup>
import { computed } from 'vue';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});

const isYoutube = computed(() => {
  const src = props.data.src || '';
  return src.includes('youtube.com') || src.includes('youtu.be');
});

function youtubeEmbed(url) {
  const idMatch =
    url.match(/(?:youtu\.be\/|v=)([\w-]{11})/) || url.match(/embed\/([\w-]{11})/);
  const id = idMatch?.[1] ?? '';
  return `https://www.youtube.com/embed/${id}`;
}
</script>

<template>
  <section
    :class="blockWrapperClass(data, 'px-4 py-12')"
    :style="blockInlineStyle(data)"
  >
    <div class="mx-auto max-w-4xl">
      <h2
        v-if="data.title"
        class="mb-6 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
      >
        {{ data.title }}
      </h2>
      <div
        v-if="data.src"
        class="aspect-video overflow-hidden rounded-2xl bg-black shadow-lg"
      >
        <iframe
          v-if="isYoutube"
          :src="youtubeEmbed(data.src)"
          class="h-full w-full"
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
        <video
          v-else
          :src="data.src"
          :poster="data.poster"
          :autoplay="data.autoplay"
          :muted="data.muted ?? data.autoplay"
          :loop="data.loop"
          :controls="data.controls !== false"
          class="h-full w-full"
          playsinline
        />
      </div>
      <p v-else class="text-center text-sm text-slate-500">No video URL set.</p>
    </div>
  </section>
</template>
