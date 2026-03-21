/**
 * Shared PWA install state. Listeners run at app bootstrap so we don't miss
 * beforeinstallprompt when it fires on first load (before /install-app is visited).
 */
import { ref } from 'vue';

export const deferredPrompt = ref(null);
export const installState = ref('idle');

let listenersInited = false;

export function initPwaInstallListeners() {
  if (listenersInited || typeof window === 'undefined') return;
  listenersInited = true;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt.value = event;
  });

  window.addEventListener('appinstalled', () => {
    installState.value = 'installed';
    deferredPrompt.value = null;
  });
}

export async function promptPwaInstall() {
  if (!deferredPrompt.value) return;

  installState.value = 'prompting';
  deferredPrompt.value.prompt();
  const choiceResult = await deferredPrompt.value.userChoice;

  installState.value = choiceResult.outcome === 'accepted' ? 'accepted' : 'dismissed';
  deferredPrompt.value = null;
}
