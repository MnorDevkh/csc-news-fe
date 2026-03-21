<script setup>
import { computed, onMounted, ref } from 'vue';

const deferredPrompt = ref(null);
const installState = ref('idle');

const canInstall = computed(() => Boolean(deferredPrompt.value));

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

async function installApp() {
  if (!deferredPrompt.value) return;

  installState.value = 'prompting';
  deferredPrompt.value.prompt();
  const choiceResult = await deferredPrompt.value.userChoice;

  installState.value = choiceResult.outcome === 'accepted' ? 'accepted' : 'dismissed';
  deferredPrompt.value = null;
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt.value = event;
  });

  window.addEventListener('appinstalled', () => {
    installState.value = 'installed';
    deferredPrompt.value = null;
  });
});
</script>

<template>
  <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Download CSC News App</h1>
    <p class="text-gray-600 mb-6">
      Install CSC News on your phone or computer for a faster local app experience.
    </p>

    <button
      type="button"
      class="px-6 py-3 rounded-lg font-medium transition-colors"
      :class="canInstall ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-500 cursor-not-allowed'"
      :disabled="!canInstall"
      @click="installApp"
    >
      Download / Install App
    </button>

    <p v-if="installState === 'accepted' || installState === 'installed'" class="text-green-600 mt-4 font-medium">
      App installed successfully.
    </p>
    <p v-else-if="installState === 'dismissed'" class="text-amber-600 mt-4">
      Installation was dismissed. You can click the button again later.
    </p>
    <p v-else-if="!canInstall" class="text-sm text-gray-500 mt-4">
      Install prompt is not available yet on this browser.
    </p>

    <div class="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-600 space-y-2">
      <p><strong>Android / Desktop Chrome:</strong> Open menu and click "Install app".</p>
      <p v-if="isIos()"><strong>iPhone/iPad:</strong> Tap Share, then "Add to Home Screen".</p>
    </div>
  </section>
</template>
