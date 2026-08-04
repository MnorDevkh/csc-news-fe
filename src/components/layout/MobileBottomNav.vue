<template>
  <nav
    :class="[
      'md:hidden inset-x-0 border-t bg-white/90 backdrop-blur-xl z-40 shadow-[0_-4px_24px_-8px_rgba(26,54,93,0.08)]',
      variant === 'amber' ? 'border-amber-200/80' : 'border-gray-200/70',
      position === 'fixed' ? 'fixed bottom-0' : 'sticky bottom-0',
    ]"
    :style="{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }"
    aria-label="Primary"
  >
    <div class="max-w-xl mx-auto flex items-stretch justify-around py-1.5 text-xs">
      <RouterLink
        v-for="(item, index) in items"
        :key="index"
        :to="item.to"
        custom
        v-slot="{ isActive, navigate, href }"
      >
        <a
          :href="href"
          class="relative flex flex-col items-center flex-1 py-2 rounded-lg mx-0.5 transition-all duration-200"
          :class="navIsActive(item, isActive) ? activeClasses(item) : inactiveClasses(item)"
          @click="navigate"
        >
          <component :is="iconComponent(item.icon)" class="h-5 w-5 mb-1 transition-transform duration-200" :class="navIsActive(item, isActive) ? 'scale-105' : ''" />
          <span class="text-[10px] font-medium">{{ item.label }}</span>
          <span
            v-if="navIsActive(item, isActive)"
            class="absolute bottom-0.5 w-5 h-0.5 rounded-full bg-accent"
          />
        </a>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { h } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

/**
 * @typedef {Object} MobileNavItem
 * @property {import('vue-router').RouteLocationRaw} to
 * @property {string} label
 * @property {'home'|'search'|'bookmark'|'settings'|'messenger'|'book'} icon
 * @property {'blue'|'amber'|'indigo'} [accent]
 * @property {string} [pathPrefix] — active when route.path equals or starts with this prefix
 * @property {string[]} [routeNames] — active when route.name is in this list
 */

defineProps({
  items: {
    type: Array,
    required: true,
  },
  variant: {
    type: String,
    default: 'gray',
    validator: (v) => v === 'gray' || v === 'amber',
  },
  position: {
    type: String,
    default: 'fixed',
    validator: (v) => v === 'fixed' || v === 'sticky',
  },
})

const route = useRoute()

function navIsActive(item, routerLinkIsActive) {
  if (item.pathPrefix) {
    const p = route.path
    return p === item.pathPrefix || p.startsWith(`${item.pathPrefix}/`)
  }
  if (item.routeNames?.length) {
    return item.routeNames.includes(route.name)
  }
  return routerLinkIsActive
}

function activeClasses(item) {
  const a = item.accent || 'blue'
  if (a === 'amber') return 'text-accent bg-accent-light/60 font-semibold'
  if (a === 'indigo') return 'text-primary bg-primary-light font-semibold'
  return 'text-primary bg-primary-light font-semibold'
}

function inactiveClasses(item) {
  const a = item.accent || 'blue'
  if (a === 'amber') return 'text-gray-400 hover:text-accent hover:bg-accent-light/40'
  if (a === 'indigo') return 'text-gray-400 hover:text-primary hover:bg-primary-light/70'
  return 'text-gray-400 hover:text-primary hover:bg-primary-light/70'
}

function iconComponent(name) {
  const icons = {
    home: () =>
      h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M3 12l9-9 9 9M5 10v10h5V14h4v6h5V10',
        }),
      ]),
    search: () =>
      h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z',
        }),
      ]),
    bookmark: () =>
      h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-3.5L6 20V4z',
        }),
      ]),
    settings: () =>
      h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M10.325 4.317a1 1 0 0 1 1.35-.437l.39.195a1 1 0 0 0 .894 0l.39-.195a1 1 0 0 1 1.35.437l.379.758a1 1 0 0 0 .746.54l.842.122a1 1 0 0 1 .884.884l.122.842a1 1 0 0 0 .54.746l.758.379a1 1 0 0 1 .437 1.35l-.195.39a1 1 0 0 0 0 .894l.195.39a1 1 0 0 1-.437 1.35l-.758.379a1 1 0 0 0-.54.746l-.122.842a1 1 0 0 1-.884.884l-.842.122a1 1 0 0 0-.746.54l-.379.758a1 1 0 0 1-1.35.437l-.39-.195a1 1 0 0 0-.894 0l-.39.195a1 1 0 0 1-1.35-.437l-.379-.758a1 1 0 0 0-.746-.54l-.842-.122a1 1 0 0 1-.884-.884l-.122-.842a1 1 0 0 0-.54-.746l-.758-.379a1 1 0 0 1-.437-1.35l.195-.39a1 1 0 0 0 0-.894l-.195-.39a1 1 0 0 1 .437-1.35l.758-.379a1 1 0 0 0 .54-.746l.122-.842a1 1 0 0 1 .884-.884l.842-.122a1 1 0 0 0 .746-.54l.379-.758z',
        }),
        h('circle', { cx: '12', cy: '12', r: '3' }),
      ]),
    messenger: () =>
      h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
        }),
      ]),
    book: () =>
      h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        }),
      ]),
  }
  return icons[name] || icons.home
}
</script>
