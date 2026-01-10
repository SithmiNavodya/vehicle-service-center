import axios from 'axios';

const API_URL = 'http://localhost:8080/api/service-record';

const serviceRecordService = {
  // Get all service records
  getAllServiceRecords: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get service record by ID
  getServiceRecordById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get service records by vehicle ID
  getServiceRecordsByVehicleId: async (vehicleId) => {
    try {
      const response = await axios.get(`${API_URL}/vehicle/${vehicleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new service record
  createServiceRecord: async (serviceRecordData) => {
    try {
      const response = await axios.post(API_URL, serviceRecordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update service record
  updateServiceRecord: async (id, serviceRecordData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, serviceRecordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete service record
  deleteServiceRecord: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all vehicles (for dropdown)
  getAllVehicles: async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/vehicles');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all services (for dropdown)
  getAllServices: async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/services');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update status
  updateStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default serviceRecordService;