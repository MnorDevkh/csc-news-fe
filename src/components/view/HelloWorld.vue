<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="text-center lg:text-left">
    <h1 class="font-medium text-[2.6rem] relative -top-2.5 text-green-600">{{ msg }}</h1>
    <h3 class="text-xl">
      You’ve successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
  </div>
</template>


