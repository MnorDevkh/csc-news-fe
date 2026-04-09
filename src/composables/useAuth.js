import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseAPI from '@/services/BaseAPI';
import { getApiBaseUrl } from '@/config/api';

const PROFILE_KEY = 'auth_profile';

/** Avoid duplicate /me calls during navigation */
let lastValidatedToken = null;

const user = ref(null);
const loading = ref(false);
const error = ref(null);
const sessionReady = ref(false);

/** @type {string[]} */
let cachedPermissions = [];
let cachedSuperuser = false;

function readStoredProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function applyProfilePayload(data) {
  cachedSuperuser = !!data.is_superuser;
  cachedPermissions = Array.isArray(data.permissions) ? [...data.permissions] : [];
  const roleName =
    typeof data.role === 'string'
      ? data.role
      : Array.isArray(data.roles) && typeof data.roles[0] === 'string'
        ? data.roles[0]
        : null;
  user.value = {
    id: data.id,
    email: data.email,
    name: data.full_name || data.email,
    full_name: data.full_name,
    role: roleName,
    roles: Array.isArray(data.roles) ? data.roles : roleName ? [roleName] : [],
    is_superuser: !!data.is_superuser,
    permissions: cachedPermissions,
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(user.value));
}

function clearSession() {
  user.value = null;
  cachedPermissions = [];
  cachedSuperuser = false;
  lastValidatedToken = null;
  localStorage.removeItem('token');
  localStorage.removeItem(PROFILE_KEY);
}

export function hasPermissionCode(code) {
  if (cachedSuperuser) return true;
  return cachedPermissions.includes(code);
}

/**
 * Load /me when a token exists. Call before router guard or on app start.
 * @returns {Promise<boolean>} true if authenticated
 */
export async function ensureSession() {
  const token = localStorage.getItem('token');
  if (!token) {
    sessionReady.value = true;
    const stored = readStoredProfile();
    if (stored?.email) {
      user.value = stored;
      cachedPermissions = stored.permissions || [];
      cachedSuperuser = !!stored.is_superuser;
    }
    return false;
  }
  if (lastValidatedToken === token && user.value) {
    sessionReady.value = true;
    return true;
  }
  try {
    const { data } = await BaseAPI.authClient.get('/auths/me');
    applyProfilePayload(data);
    lastValidatedToken = token;
    sessionReady.value = true;
    return true;
  } catch {
    clearSession();
    sessionReady.value = true;
    return false;
  }
}

export function useAuth() {
  const router = useRouter();

  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    try {
      const base = getApiBaseUrl();
      if (!base) {
        throw new Error('API URL is not configured (VITE_API_URL)');
      }
      const { data } = await BaseAPI.publicClient.post('/auths/login', {
        email,
        password,
      });
      if (!data?.access_token) {
        throw new Error('Invalid login response');
      }
      localStorage.setItem('token', data.access_token);
      const me = await BaseAPI.authClient.get('/auths/me');
      applyProfilePayload(me.data);
      lastValidatedToken = data.access_token;
      return true;
    } catch (err) {
      let msg = err.message || 'Login failed';
      const d = err.response?.data?.detail;
      if (typeof d === 'string') msg = d;
      else if (Array.isArray(d)) msg = d.map((x) => x.msg || JSON.stringify(x)).join(', ');
      error.value = msg;
      clearSession();
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    clearSession();
    sessionReady.value = true;
    router.push('/login');
  };

  const initAuth = () => {
    const token = localStorage.getItem('token');
    const stored = readStoredProfile();
    if (stored && token) {
      user.value = stored;
      cachedPermissions = stored.permissions || [];
      cachedSuperuser = !!stored.is_superuser;
    }
  };

  const isAuthenticated = computed(() => !!localStorage.getItem('token') && !!user.value);

  const hasPermission = (code) => hasPermissionCode(code);

  return {
    user,
    loading,
    error,
    login,
    logout,
    initAuth,
    isAuthenticated,
    hasPermission,
    sessionReady,
  };
}
