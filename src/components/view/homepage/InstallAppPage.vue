<script setup>
import { computed, onUnmounted, ref } from 'vue';
import {
  deferredPrompt,
  installState,
  promptPwaInstall,
} from '@/composables/pwaInstall.js';

const iosStepsEl = ref(null);
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

/** iPhone, iPod, iPad (incl. iPadOS 13+ where Safari may report as Mac) */
function isIos() {
  const ua = window.navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return true;
  if (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1) return true;
  return false;
}

/** One-tap install API exists only in Chromium-based browsers (Chrome, Edge, etc.), not Safari/Firefox */
const showManualOnly = computed(() => {
  const ua = window.navigator.userAgent;
  if (isIos()) return true;
  if (/Safari/i.test(ua) && !/Chrome|Chromium|Edg|CriOS|OPR/i.test(ua)) return true;
  return false;
});

function installApp() {
  return promptPwaInstall();
}

function focusInstallInstructions() {
  window.clearTimeout(highlightTimer);
  const manual = manualInstallEl.value;
  const ios = iosStepsEl.value;
  const help = installHelpEl.value;
  if (ios) {
    ios.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlightSection.value = 'ios';
  } else if (manual) {
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

onUnmounted(() => {
  window.clearTimeout(highlightTimer);
});
</script>

<template>
  <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-5 md:p-10">
    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Download CSC News App</h1>
    <p class="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
      Install CSC News on your phone or computer for a faster local app experience.
    </p>

    <!-- iOS / iPadOS: Add to Home Screen (only supported install path; all iOS browsers use WebKit) -->
    <div
      v-if="isIos()"
      ref="iosStepsEl"
      class="rounded-xl bg-slate-50 border border-slate-200 text-slate-800 px-4 py-4 sm:px-5 mb-6 text-sm transition-shadow duration-300"
      :class="highlightSection === 'ios' ? 'ring-2 ring-blue-400 ring-offset-2' : ''"
    >
      <p class="font-semibold text-slate-900 mb-3">Install on iPhone or iPad (Safari)</p>
      <ol class="list-decimal list-inside space-y-2.5 text-slate-700">
        <li>Open this page in <strong>Safari</strong> (required for “Add to Home Screen”).</li>
        <li>Tap the <strong>Share</strong> button (square with an arrow) — bottom bar on iPhone, top on iPad.</li>
        <li>Scroll and tap <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
      </ol>
      <p class="mt-3 text-xs text-slate-600">
        Chrome or other browsers on iOS still use Apple’s WebKit — use their menu (<strong>Share</strong> or <strong>⋮</strong>) and look for <strong>Add to Home Screen</strong>.
      </p>
    </div>

    <!-- Desktop Safari / non‑Chromium: no beforeinstallprompt -->
    <div
      v-else-if="showManualOnly"
      ref="manualInstallEl"
      class="rounded-md bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-sm mb-6 transition-shadow duration-300"
      :class="highlightSection === 'manual' ? 'ring-2 ring-amber-400 ring-offset-2' : ''"
    >
      <p class="font-medium mb-1">This browser doesn’t support the one‑click install button</p>
      <p class="mb-0 text-amber-800">
        <span v-if="isSafari()">Use <strong>File → Add to Dock</strong> (Safari on Mac) or the share menu if available.</span>
        <span v-else>Use your browser’s menu: <strong>Install app</strong> or <strong>Install CSC News</strong>.</span>
      </p>
    </div>

    <button
      type="button"
      class="px-6 py-3 rounded-md font-medium transition-colors"
      :class="
        canInstall
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : isIos() || showManualOnly
            ? 'bg-amber-600 text-white hover:bg-amber-700'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      "
      :disabled="isPrompting"
      :aria-label="canInstall ? 'Install app to your device' : 'Show how to add this app to your home screen'"
      @click="onDownloadClick"
    >
      <template v-if="canInstall">Download / Install App</template>
      <template v-else-if="isIos()">Show steps (Add to Home Screen)</template>
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
      class="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-600 space-y-2 rounded-md transition-shadow duration-300"
      :class="highlightSection === 'help' ? 'ring-2 ring-gray-300 ring-offset-2' : ''"
    >
      <p v-if="!isIos()"><strong>Chrome / Edge (desktop or Android):</strong> Menu (⋮) → <strong>Install CSC News</strong> or <strong>Install app</strong>.</p>
      <p v-if="!isIos()"><strong>Why one‑click install may be unavailable:</strong> Only Chromium on desktop/Android exposes the install prompt. You need <strong>HTTPS</strong> (or <code class="bg-gray-100 px-1 rounded">localhost</code> for dev), a valid manifest, a registered service worker, and <strong>192×192</strong> and <strong>512×512</strong> PNG icons. Open this site first, then come back here — the prompt can appear after a short moment. If you already installed the app, uninstall it to see the button again.</p>
      <p v-if="isIos()"><strong>iPhone/iPad:</strong> Apple does not allow websites to show an install popup. <strong>Add to Home Screen</strong> is the supported way to pin CSC News; use Safari for the clearest steps above.</p>
    </div>
  </section>
</template>
