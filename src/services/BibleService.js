const API_URL = 'http://127.0.0.1:8000/api/v1/categories/api/v1/categories/?skip=0&limit=100';

export const BibleService = {
  async getCategories() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};