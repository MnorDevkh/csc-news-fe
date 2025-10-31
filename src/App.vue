<script setup>
import { RouterView } from 'vue-router'
import Menus from './components/view/Menu.vue'
</script>

<template>
  <div id="app">
    <Menus />
    <RouterView />
  </div>
</template>

<style scoped>
/* You can add global styles for your app layout here */
</style>