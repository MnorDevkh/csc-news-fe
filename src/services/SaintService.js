import BaseAPI from './BaseAPI';

export const SaintService = {
  async getPublicSaints(params = {}) {
    try {
      const response = await BaseAPI.publicClient.get('/saints/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching saints:', error);
      throw error;
    }
  },

  async getPublicSaintBySlug(slug) {
    try {
      const response = await BaseAPI.publicClient.get(`/saints/slug/${encodeURIComponent(slug)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching saint by slug ${slug}:`, error);
      throw error;
    }
  },

  async getAdminSaints(params = {}) {
    try {
      const response = await BaseAPI.authClient.get('/saints/admin', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching admin saints:', error);
      throw error;
    }
  },

  async getAdminSaintById(id) {
    try {
      const response = await BaseAPI.authClient.get(`/saints/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching admin saint ${id}:`, error);
      throw error;
    }
  },

  async createSaint(data) {
    try {
      const response = await BaseAPI.authClient.post('/saints/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating saint:', error);
      throw error;
    }
  },

  async updateSaint(id, data) {
    try {
      const response = await BaseAPI.authClient.put(`/saints/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating saint ${id}:`, error);
      throw error;
    }
  },

  async deleteSaint(id) {
    try {
      const response = await BaseAPI.authClient.delete(`/saints/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting saint ${id}:`, error);
      throw error;
    }
  },
};

