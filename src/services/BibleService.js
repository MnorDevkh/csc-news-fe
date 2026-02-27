import BaseAPI from './BaseAPI';

const apiBase = import.meta.env.VITE_API_URL;
const BASE_URL = `${apiBase}/bibles`;
const CHAPTER_URL = `${apiBase}/chapters`;
const language = 'KM';

const endpoint = '/bibles';

export const BibleService = {
  /**
   * Admin: list bibles with optional params (skip, limit, language, type)
   */
  getBibles(params = {}) {
    return BaseAPI.publicClient.get(endpoint, { params });
  },

  /**
   * Admin: get single bible by ID
   */
  getBible(id) {
    return BaseAPI.publicClient.get(`${endpoint}/${id}`);
  },

  /**
   * Admin: create bible
   */
  createBible(payload) {
    return BaseAPI.authClient.post(endpoint, payload);
  },

  /**
   * Admin: update bible
   */
  updateBible(id, payload) {
    return BaseAPI.authClient.put(`${endpoint}/${id}`, payload);
  },

  /**
   * Admin: delete bible
   */
  deleteBible(id) {
    return BaseAPI.authClient.delete(`${endpoint}/${id}`);
  },

  async getBibleTypes() {
    try {
      const response = await fetch(`${BASE_URL}/types`, {
        headers: {
          accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch bible types', error);
      throw error;
    }
  },

  async getBibleList() {
    try {
      const response = await fetch(`${BASE_URL}?skip=0&limit=100&language=${language}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  async getBibleDetails(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching details for bible ID ${id}:`, error);
      throw error;
    }
  },
  async getChapterDetails(id) {
    try {
      const response = await fetch(`${CHAPTER_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching details for chapter ID ${id}:`, error);
      throw error;
    }
  },
  async searchBibles(query) {
    try {
      const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}&language=${language}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error searching bibles with query ${query}:`, error);
      throw error;
    }
  },
  async getBibleList(language, type) {
    try {
      const response = await fetch(`${BASE_URL}?skip=0&limit=100&language=${language}&type=${type}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};