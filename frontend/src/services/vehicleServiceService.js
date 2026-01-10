// frontend/src/services/vehicleServiceService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
const API_URL = `${BASE_URL}/api/services`;

export const vehicleServiceService = {
  getAllServices: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getServiceById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createService: async (serviceData) => {
    try {
      const response = await axios.post(API_URL, serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateService: async (id, serviceData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteService: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};