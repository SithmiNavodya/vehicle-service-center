// src/services/sparePartCategoryService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/spare-part-categories';

const sparePartCategoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error.response?.data || error.message;
    }
  },

  // Create new category
  createCategory: async (categoryData) => {
    try {
      const response = await axios.post(API_URL, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error.response?.data || error.message;
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error.response?.data || error.message;
    }
  },

  // Search categories
  searchCategories: async (searchTerm) => {
    try {
      const response = await axios.get(`${API_URL}/search?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default sparePartCategoryService;