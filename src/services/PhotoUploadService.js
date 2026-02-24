import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Upload a photo (multipart/form-data). Do not set Content-Type so axios sends boundary.
 * @param {File} file - image file (jpeg, png, webp)
 * @returns {Promise<{ key: string }>}
 */
export async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axios.post(`${baseURL}/photos/upload`, formData);
  return data;
}

/**
 * List uploaded photos with presigned URLs.
 * GET /photos/?skip=0&limit=100
 * @param {number} [skip=0]
 * @param {number} [limit=100]
 * @returns {Promise<Array<{ key: string, url: string, uploaded_at?: string, filename?: string }>>}
 */
export async function getPhotos(skip = 0, limit = 100) {
  const { data } = await api.get('/photos/', { params: { skip, limit } });
  return data;
}

/**
 * Get presigned URL for a photo by key.
 * GET /photos/{key}/url → { "url": "https://...?X-Amz-..." }
 * @param {string} key - Photo key (e.g. "af12....jpg" or "gallery/af12....jpg")
 * @returns {Promise<string>} Presigned URL
 */
export async function getPhotoUrl(key) {
  const { data } = await api.get(`/photos/${encodeURIComponent(key)}/url`);
  return data.url;
}
