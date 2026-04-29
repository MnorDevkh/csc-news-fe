import BaseAPI from './BaseAPI';

/**
 * Upload a photo (multipart/form-data). Do not set Content-Type so axios sends boundary.
 * @param {File} file - image file (jpeg, png, webp)
 * @returns {Promise<{ id, type, size, key, url, filename, mime_type, created_at }>}
 */
export async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem('token');
  const { data } = await BaseAPI.authClient.post('/file/', formData, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

/**
 * List uploaded photos with presigned URLs.
 * GET /file/?type=photo
 * @param {number} [skip=0]
 * @param {number} [limit=100]
 * @returns {Promise<Array<{ id, type, size, key, url, filename, created_at }>>}
 */
export async function getPhotos(skip = 0, limit = 100) {
  const { data } = await BaseAPI.publicClient.get('/file/', { params: { skip, limit, type: 'photo' } });
  return data;
}

/**
 * Get presigned URL for a photo by key.
 * @param {string} key - Short or full storage key
 * @returns {Promise<string>} Presigned URL
 */
export async function getPhotoUrl(key) {
  const { data } = await BaseAPI.publicClient.get('/file/', { params: { key, type: 'photo' } });
  const item = Array.isArray(data) ? data[0] : null;
  return item?.url || '';
}
