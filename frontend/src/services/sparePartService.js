// src/services/sparePartService.js
import { api } from './api';
export const sparePartService = {
  // Get all spare parts
  async getAllSpareParts() {
    try {
      const response = await api.get('/spare-parts');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      return [];
    }
  },

    // Get all categories
      async getAllCategories() {
        try {
          const response = await api.get('/spare-part-categories');
          console.log('Categories response:', response.data);
          return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
          console.error('Error fetching categories:', error);
          return [];
        }
      },
  // Get spare part by ID
  async getSparePartById(id) {
    try {
      const response = await api.get(`/spare-parts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching spare part ${id}:`, error);
      throw error;
    }
  },

  // Create new spare part - FIXED FORMAT
  async createSparePart(sparePartData) {
    try {
      console.log('Creating spare part with raw data:', sparePartData);

      // IMPORTANT: Send categoryId and supplierId as direct Long values, not objects
      const requestData = {
        partName: sparePartData.partName?.trim(),
        brand: sparePartData.brand?.trim() || null,
        model: sparePartData.model?.trim() || null,
        price: Number(sparePartData.price),  // Convert to Number
        quantity: Number(sparePartData.quantity),  // Convert to Number
        minQuantity: Number(sparePartData.minQuantity) || 10,  // Convert to Number
        imagePath: sparePartData.imagePath?.trim() || null,
        categoryId: Number(sparePartData.categoryId),  // DIRECT Long value
        supplierId: Number(sparePartData.supplierId)   // DIRECT Long value
      };

      console.log('📤 Sending CREATE request:', requestData);

      const response = await api.post('/spare-parts', requestData);
      console.log('✅ CREATE Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ CREATE Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create spare part');
    }
  },

  // Update existing spare part - FIXED FORMAT
  async updateSparePart(id, sparePartData) {
    try {
      console.log(`Updating spare part ${id} with data:`, sparePartData);

      // IMPORTANT: Same format as create
      const requestData = {
        partName: sparePartData.partName?.trim(),
        brand: sparePartData.brand?.trim() || null,
        model: sparePartData.model?.trim() || null,
        price: Number(sparePartData.price),
        quantity: Number(sparePartData.quantity),
        minQuantity: Number(sparePartData.minQuantity) || 10,
        imagePath: sparePartData.imagePath?.trim() || null,
        categoryId: Number(sparePartData.categoryId),  // DIRECT Long value
        supplierId: Number(sparePartData.supplierId)   // DIRECT Long value
      };

      console.log('📤 Sending UPDATE request:', requestData);

      const response = await api.put(`/spare-parts/${id}`, requestData);
      console.log('✅ UPDATE Success:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ UPDATE Error for ${id}:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update spare part');
    }
  },

  // Delete spare part
  async deleteSparePart(id) {
    try {
      console.log(`🗑️ Deleting spare part ${id}`);
      const response = await api.delete(`/spare-parts/${id}`);
      console.log('✅ DELETE Success:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ DELETE Error for ${id}:`, error.response?.data || error.message);

      // Provide better error messages
      if (error.response?.status === 409) {
        throw new Error('Cannot delete: Part is being used in service records');
      } else if (error.response?.status === 404) {
        throw new Error('Spare part not found');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error('Failed to delete spare part');
    }
  },

  // Optional: Search spare parts
  async searchSpareParts(searchTerm) {
    try {
      const response = await api.get(`/spare-parts/search?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      console.error('Error searching spare parts:', error);
      return [];
    }
  },

  // Get spare parts by category
  async getSparePartsByCategory(categoryId) {
    try {
      const response = await api.get(`/spare-parts/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching spare parts for category ${categoryId}:`, error);
      return [];
    }
  }
};