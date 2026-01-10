import { api } from './api';

export const supplierService = {
  async getAllSuppliers() {
    try {
      console.log('🔍 Fetching suppliers...');
      const response = await api.get('/suppliers');
      console.log('✅ Suppliers API response:', response);
      console.log('📦 Response data:', response.data);

      // Check if data is an array or an object with data property
      if (Array.isArray(response.data)) {
        console.log(`✅ Found ${response.data.length} suppliers`);
        return response.data; // Direct array
      } else if (response.data && Array.isArray(response.data.data)) {
        console.log(`✅ Found ${response.data.data.length} suppliers (nested)`);
        return response.data.data; // Nested array
      } else if (response.data && response.data.data) {
        console.log('⚠️ Data is not array:', response.data.data);
        return []; // Return empty array
      } else {
        console.log('⚠️ Unexpected response format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching suppliers:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  async getSupplierById(id) {
    try {
      const response = await api.get(`/suppliers/${id}`);
      console.log('Get supplier by ID response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching supplier ${id}:`, error);
      throw error;
    }
  },

  async createSupplier(supplierData) {
    try {
      console.log('Creating supplier with data:', supplierData);

      const requestData = {
        supplierCode: supplierData.supplierCode,
        supplierName: supplierData.supplierName,
        phone: supplierData.phone || '',
        email: supplierData.email || '',
        address: supplierData.address || '',
      };

      console.log('Sending to API:', requestData);
      const response = await api.post('/suppliers', requestData);
      console.log('Create response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },

  async updateSupplier(id, supplierData) {
    try {
      console.log('Updating supplier', id, 'with data:', supplierData);

      const requestData = {
        supplierCode: supplierData.supplierCode,
        supplierName: supplierData.supplierName,
        phone: supplierData.phone || '',
        email: supplierData.email || '',
        address: supplierData.address || '',
      };

      console.log('Sending update to API:', requestData);
      const response = await api.put(`/suppliers/${id}`, requestData);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating supplier ${id}:`, error);
      throw error;
    }
  },

  async deleteSupplier(id) {
    try {
      console.log('Deleting supplier:', id);
      const response = await api.delete(`/suppliers/${id}`);
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting supplier ${id}:`, error);
      throw error;
    }
  },

  async searchSuppliers(searchTerm) {
    try {
      const response = await api.get(`/suppliers/search?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      console.error('Error searching suppliers:', error);
      throw error;
    }
  },
};