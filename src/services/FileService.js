import axios from 'axios';
import BaseAPI from './BaseAPI';

/**
 * Unified file API: POST/GET/DELETE /file
 * Response items: { id, type, size, mime_type, filename, key, url, created_at }
 */

/**
 * @param {File} file
 * @returns {Promise<Object>}
 */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  // POST /file is protected; use authClient so Authorization header is attached.
  // Do not set Content-Type manually; axios will add the boundary for multipart.
  const { data } = await BaseAPI.authClient.post('/file/', formData);
  return data;
}

/**
 * @param {Object} [params]
 * @param {number} [params.skip=0]
 * @param {number} [params.limit=100]
 * @param {'video'|'audio'|'pdf'|'photo'} [params.type]
 * @param {string} [params.key] - resolve single file by storage key
 */
export async function listFiles(params = {}) {
  const { skip = 0, limit = 100, type: fileType, key } = params;
  const query = { skip, limit };
  if (fileType) query.type = fileType;
  if (key) query.key = key;
  const { data } = await BaseAPI.publicClient.get('/file/', { params: query });
  return data;
}

/**
 * @param {string} id - UUID
 */
export async function getFileById(id) {
  const { data } = await BaseAPI.publicClient.get(`/file/${id}`);
  return data;
}

/**
 * @param {string} id - UUID
 */
export async function deleteFile(id) {
  await BaseAPI.publicClient.delete(`/file/${id}`);
}
