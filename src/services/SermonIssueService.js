import BaseAPI from './BaseAPI';

export const SermonIssueService = {
  async getIssues(params = {}) {
    try {
      const response = await BaseAPI.publicClient.get('/sermon-issues/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sermon issues:', error);
      throw error;
    }
  },

  async getIssueById(id, params = {}) {
    try {
      const client = params.public_only === false ? BaseAPI.authClient : BaseAPI.publicClient;
      const response = await client.get(`/sermon-issues/${id}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching sermon issue ${id}:`, error);
      throw error;
    }
  },

  async getIssueBySlug(slug, params = {}) {
    try {
      const client = params.public_only === false ? BaseAPI.authClient : BaseAPI.publicClient;
      const response = await client.get(
        `/sermon-issues/slug/${encodeURIComponent(slug)}`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching sermon issue by slug ${slug}:`, error);
      throw error;
    }
  },

  async createIssue(data) {
    try {
      const response = await BaseAPI.authClient.post('/sermon-issues/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating sermon issue:', error);
      throw error;
    }
  },

  async updateIssue(id, data) {
    try {
      const response = await BaseAPI.authClient.put(`/sermon-issues/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating sermon issue ${id}:`, error);
      throw error;
    }
  },

  async deleteIssue(id) {
    try {
      const response = await BaseAPI.authClient.delete(`/sermon-issues/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting sermon issue ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload PDF file for a Sermon issue.
   * @param {File} file - PDF file
   * @returns {Promise<{ key: string, url: string }>}
   */
  async uploadPdf(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await BaseAPI.authClient.post('/file/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading sermon issue PDF:', error);
      throw error;
    }
  },
};
