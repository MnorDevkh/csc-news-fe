<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

const deferredPrompt = ref(null);
const installState = ref('idle');
const manualInstallEl = ref(null);
const installHelpEl = ref(null);
/** Which block to briefly highlight after clicking the CTA when there’s no PWA prompt */
const highlightSection = ref(null);
let highlightTimer = 0;

const canInstall = computed(() => Boolean(deferredPrompt.value));
const isPrompting = computed(() => installState.value === 'prompting');

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

function focusInstallInstructions() {
  window.clearTimeout(highlightTimer);
  const manual = manualInstallEl.value;
  const help = installHelpEl.value;
  if (manual) {
    manual.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlightSection.value = 'manual';
  } else if (help) {
    help.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlightSection.value = 'help';
  }
  highlightTimer = window.setTimeout(() => {
    highlightSection.value = null;
  }, 2200);
}

/** One handler for the download CTA: PWA prompt when supported, else scroll to Add to Home Screen / install help */
function onDownloadClick() {
  if (isPrompting.value) return;
  if (canInstall.value) {
    installApp();
    return;
  }
  focusInstallInstructions();
}

function onBeforeInstallPrompt(event) {
  event.preventDefault();
  deferredPrompt.value = event;
}

function onAppInstalled() {
  installState.value = 'installed';
  deferredPrompt.value = null;
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  window.addEventListener('appinstalled', onAppInstalled);
});

onUnmounted(() => {
  window.clearTimeout(highlightTimer);
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  window.removeEventListener('appinstalled', onAppInstalled);
});
</script>

<template>
  <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-5 md:p-10">
    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Download CSC News App</h1>
    <p class="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
      Install CSC News on your phone or computer for a faster local app experience.
    </p>

    <!-- iOS / Safari: no programmatic install API -->
    <div
      v-if="showManualOnly"
      ref="manualInstallEl"
      class="rounded-lg bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-sm mb-6 transition-shadow duration-300"
      :class="highlightSection === 'manual' ? 'ring-2 ring-amber-400 ring-offset-2' : ''"
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
      :class="
        canInstall
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : showManualOnly
            ? 'bg-amber-600 text-white hover:bg-amber-700'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      "
      :disabled="isPrompting"
      :aria-label="canInstall ? 'Install app to your device' : 'Show how to add this app to your home screen'"
      @click="onDownloadClick"
    >
      <template v-if="canInstall">Download / Install App</template>
      <template v-else-if="showManualOnly">Add to Home Screen — how to</template>
      <template v-else>Install help</template>
    </button>

    <p v-if="installState === 'accepted' || installState === 'installed'" class="text-green-600 mt-4 font-medium">
      App installed successfully.
    </p>
    <p v-else-if="installState === 'dismissed'" class="text-amber-600 mt-4">
      Installation was dismissed. You can click the button again later.
    </p>

    <div
      ref="installHelpEl"
      class="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-600 space-y-2 rounded-lg transition-shadow duration-300"
      :class="highlightSection === 'help' ? 'ring-2 ring-gray-300 ring-offset-2' : ''"
    >
      <p><strong>Chrome / Edge (desktop or Android):</strong> Menu (⋮) → <strong>Install CSC News</strong> or <strong>Install app</strong>.</p>
      <p><strong>Why one‑click install may be unavailable:</strong> Only Chromium browsers fire the install event. You need <strong>HTTPS</strong> (or <code class="bg-gray-100 px-1 rounded">localhost</code> for dev), a valid web app manifest, a service worker, and PNG icons — we’ve added 192×512 icons for that. If you already installed the app, uninstall it first to see the prompt again.</p>
      <p v-if="isIos()"><strong>iPhone/iPad:</strong> In Safari, tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</p>
    </div>
  </section>
</template>
