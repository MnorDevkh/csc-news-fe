<script setup>
import { computed, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  deferredPrompt,
  installState,
  promptPwaInstall,
} from '@/composables/pwaInstall.js';

const { t } = useI18n();

const iosStepsEl = ref(null);
const manualInstallEl = ref(null);
const installHelpEl = ref(null);
const highlightSection = ref(null);
let highlightTimer = 0;

const canInstall = computed(() => Boolean(deferredPrompt.value));
const isPrompting = computed(() => installState.value === 'prompting');

function isSafari() {
  const ua = window.navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(ua);
}

function isIos() {
  const ua = window.navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return true;
  if (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1) return true;
  return false;
}

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
    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">{{ t('installApp.pageTitle') }}</h1>
    <p class="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
      {{ t('installApp.pageSubtitle') }}
    </p>

    <div
      v-if="isIos()"
      ref="iosStepsEl"
      class="rounded-xl bg-slate-50 border border-slate-200 text-slate-800 px-4 py-4 sm:px-5 mb-6 text-sm transition-shadow duration-300"
      :class="highlightSection === 'ios' ? 'ring-2 ring-blue-400 ring-offset-2' : ''"
    >
      <p class="font-semibold text-slate-900 mb-3">{{ t('installApp.iosSafariTitle') }}</p>
      <ol class="list-decimal list-inside space-y-2.5 text-slate-700">
        <li v-html="t('installApp.iosStep1')" />
        <li v-html="t('installApp.iosStep2')" />
        <li v-html="t('installApp.iosStep3')" />
      </ol>
      <p class="mt-3 text-xs text-slate-600" v-html="t('installApp.iosChromeNote')" />
    </div>

    <div
      v-else-if="showManualOnly"
      ref="manualInstallEl"
      class="rounded-md bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-sm mb-6 transition-shadow duration-300"
      :class="highlightSection === 'manual' ? 'ring-2 ring-amber-400 ring-offset-2' : ''"
    >
      <p class="font-medium mb-1">{{ t('installApp.manualNoButton') }}</p>
      <p class="mb-0 text-amber-800">
        <span v-if="isSafari()" v-html="t('installApp.safariDock')" />
        <span v-else v-html="t('installApp.otherBrowserMenu')" />
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
      :aria-label="canInstall ? t('installApp.ariaInstall') : t('installApp.ariaShowSteps')"
      @click="onDownloadClick"
    >
      <template v-if="canInstall">{{ t('installApp.downloadInstall') }}</template>
      <template v-else-if="isIos()">{{ t('installApp.showSteps') }}</template>
      <template v-else-if="showManualOnly">{{ t('installApp.howToAdd') }}</template>
      <template v-else>{{ t('installApp.installHelp') }}</template>
    </button>

    <p v-if="installState === 'accepted' || installState === 'installed'" class="text-green-600 mt-4 font-medium">
      {{ t('installApp.installSuccess') }}
    </p>
    <p v-else-if="installState === 'dismissed'" class="text-amber-600 mt-4">
      {{ t('installApp.installDismissed') }}
    </p>

    <div
      ref="installHelpEl"
      class="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-600 space-y-2 rounded-md transition-shadow duration-300"
      :class="highlightSection === 'help' ? 'ring-2 ring-gray-300 ring-offset-2' : ''"
    >
      <p v-if="!isIos()" v-html="t('installApp.helpChrome')" />
      <p v-if="!isIos()" v-html="t('installApp.helpWhyUnavailable')" />
      <p v-if="isIos()" v-html="t('installApp.helpIos')" />
    </div>
  </section>
</template>
