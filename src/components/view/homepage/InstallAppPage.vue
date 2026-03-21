<script setup>
import { computed, onMounted, ref } from 'vue';

const deferredPrompt = ref(null);
const installState = ref('idle');

const canInstall = computed(() => Boolean(deferredPrompt.value));

/** Safari (desktop) never fires beforeinstallprompt for “Add to Dock” the same way; iOS never exposes it */
function isSafari() {
  const ua = window.navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(ua);
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

/** One-tap install API exists only in Chromium-based browsers (Chrome, Edge, etc.), not Safari/Firefox */
const showManualOnly = computed(() => {
  const ua = window.navigator.userAgent;
  if (isIos()) return true;
  if (/Safari/i.test(ua) && !/Chrome|Chromium|Edg|CriOS|OPR/i.test(ua)) return true;
  return false;
});

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

    <!-- iOS / Safari: no programmatic install API -->
    <div
      v-if="showManualOnly"
      class="rounded-lg bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-sm mb-6"
    >
      <p class="font-medium mb-1">This browser doesn’t support the one‑click install button</p>
      <p class="mb-0 text-amber-800">
        <span v-if="isIos() || isSafari()">Use <strong>Share → Add to Home Screen</strong> (Safari on iPhone/iPad).</span>
        <span v-else>Use your browser’s menu: <strong>Install app</strong> or <strong>Install CSC News</strong>.</span>
      </p>
    </div>

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
    <p v-else-if="!canInstall && !showManualOnly" class="text-sm text-gray-500 mt-4">
      Install prompt is not available yet. Use HTTPS, open the site in Chrome/Edge, or install from the browser menu
      (⋮ → Install app). If you already installed the app, uninstall it first to see the prompt again.
    </p>

    <div class="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-600 space-y-2">
      <p><strong>Chrome / Edge (desktop or Android):</strong> Menu (⋮) → <strong>Install CSC News</strong> or <strong>Install app</strong>.</p>
      <p><strong>Why the button stays gray:</strong> Only Chromium browsers fire the install event. You need <strong>HTTPS</strong> (or <code class="bg-gray-100 px-1 rounded">localhost</code> for dev), a valid web app manifest, a service worker, and PNG icons — we’ve added 192×512 icons for that.</p>
      <p v-if="isIos()"><strong>iPhone/iPad:</strong> In Safari, tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</p>
    </div>
  </section>
</template>
