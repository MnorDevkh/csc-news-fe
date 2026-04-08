<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router'
import { ConfigProvider } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue';
import Menus from './components/view/Menu.vue'
import Footer from './components/view/Footer.vue'
import MobileBottomNav from './components/layout/MobileBottomNav.vue'
import { usePullToRefresh, isPwaDisplayMode, isMobileTouch } from './composables/usePullToRefresh.js'

const antdTheme = {
  token: {
    colorPrimary: '#1a365d',
    colorLink: '#1a365d',
    borderRadiusLG: 14,
    borderRadius: 10,
    fontFamily: "'Kantumruy Pro', 'Khmer', 'Koh Santepheap', 'Inter', sans-serif",
  },
}

const route = useRoute();
const isAdminOrLogin = computed(() => {
  const path = route.path;
  return path.startsWith('/login') || path.startsWith('/admin');
});

const showMobileTabBar = computed(
  () => !isAdminOrLogin.value && !route.path.startsWith('/read')
);

const mainMobileNavItems = [
  { to: '/', label: 'Home', icon: 'home', accent: 'blue' },
  {
    to: { name: 'bibleReadHome' },
    label: 'Bible',
    icon: 'book',
    accent: 'blue',
    pathPrefix: '/read',
  },
  {
    to: { name: 'searchResults', query: { q: '' } },
    label: 'Search',
    icon: 'search',
    accent: 'blue',
    routeNames: ['searchResults'],
  },
  {
    to: { name: 'messengerList' },
    label: 'Messenger',
    icon: 'messenger',
    accent: 'blue',
    pathPrefix: '/the-messenger',
  },
];

const pullToRefreshEnabled = computed(() => {
  if (isAdminOrLogin.value) return false;
  return isPwaDisplayMode() && isMobileTouch();
});

const { pullDistance, isRefreshing } = usePullToRefresh(pullToRefreshEnabled);

const contentPullStyle = computed(() => {
  if (!pullToRefreshEnabled.value || pullDistance.value <= 0) return {};
  return { transform: `translateY(${Math.min(pullDistance.value * 0.35, 28)}px)` };
});
</script>

<template>
  <ConfigProvider :theme="antdTheme">
  <div id="app" class="w-full" :class="{ 'bg-surface': !isAdminOrLogin }">
    <div
      v-if="pullToRefreshEnabled"
      class="fixed left-0 right-0 top-0 z-[60] pointer-events-none flex justify-center items-start overflow-hidden text-primary transition-[height] duration-75 ease-out"
      :style="{ height: `${pullDistance}px` }"
      aria-hidden="true"
    >
      <LoadingOutlined
        v-if="pullDistance > 12 || isRefreshing"
        class="text-xl mt-1"
        :spin="isRefreshing || pullDistance >= 72"
      />
    </div>
    <div
      :class="{ 'mx-auto w-full flex flex-col min-h-[100dvh]': !isAdminOrLogin }"
      :style="pullToRefreshEnabled ? contentPullStyle : undefined"
    >
      <Menus v-if="!isAdminOrLogin" />
      <div
        :class="[
          showMobileTabBar
            ? 'pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0'
            : '',
        ]"
      >
        <RouterView
          :class="{
            'px-[5px] sm:px-5 md:px-6 lg:px-8 xl:px-10': !isAdminOrLogin,
          }"
        />
      </div>
      <Footer v-if="!isAdminOrLogin" />
      <MobileBottomNav
        v-if="showMobileTabBar"
        :items="mainMobileNavItems"
        variant="gray"
        position="fixed"
      />
    </div>
  </div>
  </ConfigProvider>
</template>