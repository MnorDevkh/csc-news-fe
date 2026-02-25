import BaseAPI from './BaseAPI';

export const DailyReadingService = {
  async getAllReadings(params = {}) {
    try {
      const response = await BaseAPI.publicClient.get('/daily-bible-readings/', { params });
      return response.data.items || response.data || [];
    } catch (error) {
      console.error('Error fetching daily readings:', error);
      throw error;
    }
  },

  async getReadingById(id) {
    try {
      const response = await BaseAPI.publicClient.get(`/daily-bible-readings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching daily reading ${id}:`, error);
      throw error;
    }
  },

  async createReading(data) {
    try {
      const response = await BaseAPI.authClient.post('/daily-bible-readings/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating daily reading:', error);
      throw error;
    }
  },

  async updateReading(id, data) {
    try {
      const response = await BaseAPI.authClient.put(`/daily-bible-readings/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating daily reading ${id}:`, error);
      throw error;
    }
  },

  async deleteReading(id) {
    try {
      const response = await BaseAPI.authClient.delete(`/daily-bible-readings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting daily reading ${id}:`, error);
      throw error;
    }
  },
};

