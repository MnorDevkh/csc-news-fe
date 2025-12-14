<script setup>
import { RouterView } from 'vue-router'
import Menus from './components/view/Menu.vue'
</script>

<template>
  <div id="app" class="bg-background-light">
    <Menus/>
    <RouterView class="mx-auto px-8"/>
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
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 1400px;
}
</style>