import axios from 'axios';

const API_URL = 'http://localhost:8080/api/vehicles';

const vehicleService = {
  // Get all vehicles
  getAllVehicles: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get vehicle by ID
  getVehicleById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new vehicle
  createVehicle: async (vehicleData) => {
    try {
      const response = await axios.post(API_URL, vehicleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update vehicle
  updateVehicle: async (id, vehicleData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, vehicleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all customers (for dropdown)
  getAllCustomers: async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/customers');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default vehicleService;