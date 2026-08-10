<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ConfigProvider } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue';
import Menus from './components/view/Menu.vue'
import Footer from './components/view/Footer.vue'
import MobileBottomNav from './components/layout/MobileBottomNav.vue'
import { usePullToRefresh, isPwaDisplayMode, isMobileTouch } from './composables/usePullToRefresh.js'

const antdTheme = {
  token: {
    colorPrimary: '#1e5a96',
    colorLink: '#1e5a96',
    colorInfo: '#1e5a96',
    colorSuccess: '#059669',
    colorWarning: '#d97706',
    colorError: '#dc2626',
    colorLinkHover: '#2f7fc1',
    colorPrimaryHover: '#174a7c',
    colorPrimaryActive: '#123a63',
    controlOutline: 'rgba(30, 90, 150, 0.18)',
    controlItemBgHover: '#e8f1f9',
    controlItemBgActive: '#e8f1f9',
    borderRadiusLG: 8,
    borderRadius: 4,
    fontFamily: "'Kantumruy Pro', 'Khmer', 'Koh Santepheap', sans-serif",
    colorBgContainer: '#ffffff',
  },
}

const route = useRoute();
const { t } = useI18n();

const isAdminOrLogin = computed(() => {
  const path = route.path;
  return path.startsWith('/login') || path.startsWith('/admin');
});

const showMobileTabBar = computed(
  () => !isAdminOrLogin.value && !route.path.startsWith('/read')
);

const mainMobileNavItems = computed(() => [
  { to: '/', label: t('nav.home'), icon: 'home', accent: 'blue' },
  {
    to: { name: 'bibleReadHome' },
    label: t('nav.bible'),
    icon: 'book',
    accent: 'blue',
    pathPrefix: '/read',
  },
  {
    to: { name: 'searchResults', query: { q: '' } },
    label: t('nav.search'),
    icon: 'search',
    accent: 'blue',
    routeNames: ['searchResults'],
  },
  {
    to: { name: 'messengerList' },
    label: t('nav.messenger'),
    icon: 'messenger',
    accent: 'blue',
    pathPrefix: '/the-messenger',
  },
  {
    to: { name: 'sermonIssueList' },
    label: t('nav.sermon'),
    icon: 'messenger',
    accent: 'blue',
    pathPrefix: '/the-sermon',
  },
]);

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
  <div id="app" class="w-full" :class="{ 'bg-cream': !isAdminOrLogin }">
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
        class="flex-1"
        :class="[
          showMobileTabBar
            ? 'pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0'
            : '',
        ]"
      >
        <RouterView
          :class="{
            'px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10': !isAdminOrLogin,
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