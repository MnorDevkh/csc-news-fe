import BaseAPI from './BaseAPI';

export const SermonService = {
  async getAllSermons(params = {}) {
    try {
      const response = await BaseAPI.publicClient.get('/sermons/', { params });
      return response.data.items || response.data || [];
    } catch (error) {
      console.error('Error fetching sermons:', error);
      throw error;
    }
  },

  async getSermonById(id) {
    try {
      const response = await BaseAPI.publicClient.get(`/sermons/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sermon ${id}:`, error);
      throw error;
    }
  },

  async createSermon(data) {
    try {
      const response = await BaseAPI.authClient.post('/sermons/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating sermon:', error);
      throw error;
    }
  },

  async updateSermon(id, data) {
    try {
      const response = await BaseAPI.authClient.put(`/sermons/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating sermon ${id}:`, error);
      throw error;
    }
  },

  async deleteSermon(id) {
    try {
      const response = await BaseAPI.authClient.delete(`/sermons/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting sermon ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload sermon audio/video media.
   * @param {File} file - audio or video file
   * @returns {Promise<{ key: string, url: string }>}
   */
  async uploadMedia(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await BaseAPI.publicClient.post('/file/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading sermon media:', error);
      throw error;
    }
  },
};

