import BaseAPI from './BaseAPI';

export const CategoryService = {
    async getAllCategories(params = {}) {
        try {
            const response = await BaseAPI.publicClient.get('/categories/', { params });
            // Helper to consistently return items array if paginated, or data if list
            const items = response?.data?.items;
            if (Array.isArray(items)) return items;

            // Some APIs might return a raw array as `response.data`
            if (Array.isArray(response?.data)) return response.data;

            return [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    async getCategoryById(id) {
        try {
            const response = await BaseAPI.publicClient.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching category ${id}:`, error);
            throw error;
        }
    },

    async createCategory(data) {
        try {
            const response = await BaseAPI.authClient.post('/categories/', data);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    async updateCategory(id, data) {
        try {
            const response = await BaseAPI.authClient.put(`/categories/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating category ${id}:`, error);
            throw error;
        }
    },

    async deleteCategory(id) {
        try {
            const response = await BaseAPI.authClient.delete(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting category ${id}:`, error);
            throw error;
        }
    }
};
