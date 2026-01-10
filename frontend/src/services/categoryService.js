// src/services/sparePartCategoryService.js (correct name and endpoints)
import api from './api';

export const sparePartCategoryService = {
  async getAllCategories() {
    try {
      console.log('🔍 Fetching categories...');
      const response = await api.get('/spare-part-categories');
      console.log('✅ Categories API response:', response);

      // Check response format
      if (Array.isArray(response.data)) {
        console.log(`✅ Found ${response.data.length} categories`);
        return response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      throw error;
    }
  },

  async getCategoryById(id) {
    try {
      const response = await api.get(`/spare-part-categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  async createCategory(categoryData) {
    try {
      console.log('Creating category:', categoryData);
      const response = await api.post('/spare-part-categories', categoryData);
      console.log('Create response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async updateCategory(id, categoryData) {
    try {
      console.log(`Updating category ${id}:`, categoryData);
      const response = await api.put(`/spare-part-categories/${id}`, categoryData);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  async deleteCategory(id) {
    try {
      console.log('Deleting category:', id);
      const response = await api.delete(`/spare-part-categories/${id}`);
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  async searchCategories(searchTerm) {
    try {
      const response = await api.get(`/spare-part-categories/search?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  }
};