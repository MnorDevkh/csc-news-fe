<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router'
import Menus from './components/view/Menu.vue'
import Footer from './components/view/Footer.vue'

const route = useRoute();
const isAdminOrLogin = computed(() => {
  const path = route.path;
  return path.startsWith('/login') || path.startsWith('/admin');
});
</script>

<template>
  <div id="app" :class="{ 'bg-background-light': !isAdminOrLogin, 'w-full': true }" class="w-full bg-blue-500">
    <div :class="{ 'mx-auto w-full flex flex-col min-h-screen': !isAdminOrLogin }">
      <Menus v-if="!isAdminOrLogin" />
      <RouterView :class="{ 'px-8': !isAdminOrLogin }" />
      <Footer v-if="!isAdminOrLogin" />
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-menu) {
  font-family: 'Kantumruy Pro', 'Khmer', 'Koh Santepheap', sans-serif !important;
}

:deep(.ant-menu-item),
:deep(.ant-menu-submenu-title) {
  font-family: 'Kantumruy Pro', 'Khmer', 'Koh Santepheap', sans-serif !important;
}
</style>