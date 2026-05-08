import axios from 'axios';
import { getApiBaseUrl } from '@/config/api';
import BaseAPI from './BaseAPI';

const baseURL = getApiBaseUrl();
const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });

/**
 * @typedef {Object} GalleryImageItem
 * @property {string} url
 * @property {string} [title]
 */

/**
 * @typedef {Object} GalleryPayload
 * @property {string} title
 * @property {string} [description]
 * @property {string} [cover]
 * @property {GalleryImageItem[]} [images]
 */

export const GalleryService = {
  async list(skip = 0, limit = 100) {
    const { data } = await api.get('/galleries/', { params: { skip, limit } });
    return data;
  },

  async get(id) {
    const { data } = await api.get(`/galleries/${id}`);
    return data;
  },

  /**
   * @param {GalleryPayload} payload
   */
  async create(payload) {
    const { data } = await BaseAPI.authClient.post('/galleries/', payload);
    return data;
  },

  /**
   * @param {string} id
   * @param {Partial<GalleryPayload>} payload
   */
  async update(id, payload) {
    const { data } = await BaseAPI.authClient.put(`/galleries/${id}`, payload);
    return data;
  },

  async delete(id) {
    await api.delete(`/galleries/${id}`);
  }
};
