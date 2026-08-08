<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { blockWrapperClass, blockInlineStyle } from '../utils/blockStyles';
import { cn } from '../utils/cn';

const props = defineProps({
  data: { type: Object, default: () => ({}) },
});

const cols = computed(
  () =>
    ({
      2: 'sm:grid-cols-2',
      3: 'sm:grid-cols-2 lg:grid-cols-3',
      4: 'sm:grid-cols-2 lg:grid-cols-4',
    })[props.data.columns ?? 4]
);

function isExternal(link) {
  return /^https?:\/\//.test(link || '');
}

function linkLabel(card) {
  return card.linkLabel || 'បើក';
}
</script>

<template>
  <section
    :class="
      blockWrapperClass(
        data,
        'border-y border-line bg-surface-soft section-pad'
      )
    "
    :style="blockInlineStyle(data)"
  >
    <div class="container-site mx-auto">
      <div v-if="data.title || data.subtitle" class="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2
          v-if="data.title"
          class="font-display text-3xl font-semibold tracking-tight text-navy sm:text-5xl m-0"
        >
          {{ data.title }}
        </h2>
        <div v-if="data.title" class="gold-rule mx-auto mt-4"></div>
        <p
          v-if="data.subtitle"
          class="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg m-0"
        >
          {{ data.subtitle }}
        </p>
      </div>

      <ul :class="cn('grid list-none gap-4 p-0 m-0 sm:gap-5', cols)">
        <li v-for="(card, i) in data.cards || []" :key="i" class="min-h-0">
          <component
            :is="card.link ? (isExternal(card.link) ? 'a' : RouterLink) : 'article'"
            v-bind="
              card.link
                ? isExternal(card.link)
                  ? { href: card.link, target: '_blank', rel: 'noopener noreferrer' }
                  : { to: card.link }
                : {}
            "
            class="archive-card group"
          >
            <img
              v-if="card.image"
              :src="card.image"
              :alt="card.title"
              class="mb-4 aspect-[16/10] w-full object-cover bg-cream-dark"
            />

            <div
              v-if="card.icon"
              class="archive-card__icon"
              aria-hidden="true"
            >
              <span class="text-xl leading-none">{{ card.icon }}</span>
            </div>
            <div
              v-else-if="!card.image"
              class="h-5 w-5 border border-gold/40"
              aria-hidden="true"
            />

            <h3 class="archive-card__title">
              {{ card.title }}
            </h3>

            <p
              v-if="card.description"
              class="archive-card__text"
            >
              {{ card.description }}
            </p>

            <span
              v-if="card.link"
              class="archive-card__cta"
            >
              {{ linkLabel(card) }}
              <svg
                class="archive-card__cta-icon h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </component>
        </li>
      </ul>
    </div>
  </section>
</template>
