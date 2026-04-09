import { hasPermissionCode } from '@/composables/useAuth';

function normalize(value) {
  if (Array.isArray(value)) return value.filter((x) => typeof x === 'string' && x.trim() !== '');
  if (typeof value === 'string' && value.trim() !== '') return [value];
  return [];
}

function allowed(required) {
  const req = normalize(required);
  if (!req.length) return true;
  return req.every((p) => hasPermissionCode(p));
}

/**
 * Usage:
 *  - v-can="'WRITE-NEWS'"
 *  - v-can="['WRITE-NEWS','CREATE-NEWS']"  // requires all
 */
export const vCan = {
  mounted(el, binding) {
    if (!allowed(binding.value)) {
      el.style.display = 'none';
      el.setAttribute('data-v-can-hidden', 'true');
    }
  },
  updated(el, binding) {
    const hide = !allowed(binding.value);
    if (hide) {
      el.style.display = 'none';
      el.setAttribute('data-v-can-hidden', 'true');
    } else {
      if (el.getAttribute('data-v-can-hidden') === 'true') {
        el.style.display = '';
        el.removeAttribute('data-v-can-hidden');
      }
    }
  },
};

