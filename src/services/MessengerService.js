import BaseAPI from './BaseAPI';

export const MessengerService = {
  async getIssues(params = {}) {
    try {
      const response = await BaseAPI.publicClient.get('/messenger-issues/', { params });
      // Backend returns a paginated object; ensure consistent shape
      return response.data;
    } catch (error) {
      console.error('Error fetching messenger issues:', error);
      throw error;
    }
  },

  async getIssueById(id) {
    try {
      const response = await BaseAPI.publicClient.get(`/messenger-issues/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching messenger issue ${id}:`, error);
      throw error;
    }
  },

  async getIssueBySlug(slug) {
    try {
      const response = await BaseAPI.publicClient.get(`/messenger-issues/slug/${encodeURIComponent(slug)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching messenger issue by slug ${slug}:`, error);
      throw error;
    }
  },

  async createIssue(data) {
    try {
      const response = await BaseAPI.authClient.post('/messenger-issues/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating messenger issue:', error);
      throw error;
    }
  },

  async updateIssue(id, data) {
    try {
      const response = await BaseAPI.authClient.put(`/messenger-issues/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating messenger issue ${id}:`, error);
      throw error;
    }
  },

  async deleteIssue(id) {
    try {
      const response = await BaseAPI.authClient.delete(`/messenger-issues/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting messenger issue ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload PDF file for a Messenger issue.
   * @param {File} file - PDF file
   * @returns {Promise<{ key: string, url: string }>}
   */
  async uploadPdf(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await BaseAPI.publicClient.post('/messenger-issues/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading messenger PDF:', error);
      throw error;
    }
  },
};

