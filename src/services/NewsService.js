import BaseAPI from './BaseAPI';

export const NewsService = {
  async getFeaturedArticles() {
    try {
      const response = await BaseAPI.publicClient.get('/articles', {
        params: {
          is_featured: true,
          limit: 4
        }
      });
      // Handle the response structure from get_articles ({ items: [], ... })
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      return [];
    }
  },

  async getLatestHeadlines() {
    try {
      const response = await BaseAPI.publicClient.get('/articles', {
        params: {
          limit: 5 // Adjust limit as needed
        }
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching latest headlines:', error);
      return [];
    }
  },

  async getNewsCategories() {
    try {
      const response = await BaseAPI.publicClient.get('/categories');
      // The API returns a list of category objects. 
      // If the UI expects just names, we might need to map it, 
      // but let's return the full objects and update the UI to handle it.
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching news categories:', error);
      return [];
    }
  },

  async getAllArticles(params = {}) {
    try {
      const response = await BaseAPI.publicClient.get('/articles', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  async getArticleById(id) {
    try {
      const response = await BaseAPI.publicClient.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching article ${id}:`, error);
      throw error;
    }
  },

  async createArticle(data) {
    try {
      const response = await BaseAPI.authClient.post('/articles/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  async updateArticle(id, data) {
    try {
      const response = await BaseAPI.authClient.put(`/articles/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating article ${id}:`, error);
      throw error;
    }
  },

  async deleteArticle(id) {
    try {
      const response = await BaseAPI.authClient.delete(`/articles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting article ${id}:`, error);
      throw error;
    }
  }
};