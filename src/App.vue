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
  <div id="app" class="w-full" :class="{ 'bg-gray-50': !isAdminOrLogin }">
    <div :class="{ 'mx-auto w-full flex flex-col min-h-[100dvh]': !isAdminOrLogin }">
      <Menus v-if="!isAdminOrLogin" />
      <RouterView :class="{ 'px-0 sm:px-5 lg:px-8': !isAdminOrLogin }" />
      <Footer v-if="!isAdminOrLogin" />
    </div>
  </div>
</template>