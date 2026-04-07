/**
 * Backend API root (no trailing slash).
 * Set VITE_API_URL in .env — see .env.example (e.g. http://127.0.0.1:8000/api/v1).
 */
export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL;
  if (raw == null || String(raw).trim() === '') {
    if (import.meta.env.DEV) {
      console.warn(
        '[csc-news] VITE_API_URL is missing. Copy .env.example to .env and set VITE_API_URL to your API base.'
      );
    }
    return '';
  }
  return String(raw).trim().replace(/\/$/, '');
}
