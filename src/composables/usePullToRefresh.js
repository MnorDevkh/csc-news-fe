import { ref, watch, onUnmounted, unref } from 'vue';

const THRESHOLD = 72;
const MAX_PULL = 110;

/** Installed PWA / standalone (no browser chrome). */
export function isPwaDisplayMode() {
  if (typeof window === 'undefined') return false;
  if (window.navigator.standalone === true) return true;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches
  );
}

export function isMobileTouch() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(pointer: coarse)').matches) return true;
  return window.matchMedia('(max-width: 768px)').matches;
}

function isAtScrollTop() {
  return window.scrollY <= 0 && document.documentElement.scrollTop <= 0;
}

function resistance(raw) {
  const t = Math.min(raw / MAX_PULL, 1);
  return MAX_PULL * (1 - Math.pow(1 - t, 1.6));
}

/**
 * Pull-to-refresh for document scroll (PWA / mobile).
 * @param {import('vue').Ref<boolean> | import('vue').ComputedRef<boolean>} enabled
 */
export function usePullToRefresh(enabled) {
  const pullDistance = ref(0);
  const isRefreshing = ref(false);

  let startY = 0;
  let startX = 0;
  let tracking = false;
  let verticalDominant = false;

  function resetTracking() {
    tracking = false;
    verticalDominant = false;
    pullDistance.value = 0;
  }

  function onTouchStart(e) {
    if (!unref(enabled)) return;
    if (!isAtScrollTop()) return;
    const t = e.touches[0];
    startY = t.clientY;
    startX = t.clientX;
    tracking = true;
    verticalDominant = false;
  }

  function onTouchMove(e) {
    if (!unref(enabled) || !tracking) return;

    const t = e.touches[0];
    const dy = t.clientY - startY;
    const dx = t.clientX - startX;

    if (!verticalDominant) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        tracking = false;
        pullDistance.value = 0;
        return;
      }
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        verticalDominant = true;
      } else if (Math.abs(dy) <= 10) {
        return;
      }
    }

    if (!verticalDominant) return;

    if (!isAtScrollTop() && pullDistance.value === 0) {
      resetTracking();
      return;
    }

    if (dy > 0 && isAtScrollTop()) {
      e.preventDefault();
      pullDistance.value = Math.min(resistance(dy), MAX_PULL);
    } else if (dy <= 0) {
      pullDistance.value = 0;
    }
  }

  function onTouchEnd() {
    if (!unref(enabled) || !tracking) {
      resetTracking();
      return;
    }

    const shouldRefresh = verticalDominant && pullDistance.value >= THRESHOLD;
    tracking = false;
    verticalDominant = false;

    if (shouldRefresh) {
      isRefreshing.value = true;
      pullDistance.value = THRESHOLD;
      window.location.reload();
      return;
    }

    pullDistance.value = 0;
  }

  function onTouchCancel() {
    resetTracking();
  }

  let stop = null;

  function attach() {
    if (typeof window === 'undefined') return;
    const opts = { passive: false };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, opts);
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchCancel, { passive: true });
    stop = () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchCancel);
      stop = null;
    };
  }

  function detach() {
    stop?.();
    resetTracking();
    isRefreshing.value = false;
  }

  watch(
    () => unref(enabled),
    (on) => {
      detach();
      if (on) attach();
    },
    { immediate: true }
  );

  onUnmounted(() => {
    detach();
  });

  return {
    pullDistance,
    isRefreshing,
  };
}
