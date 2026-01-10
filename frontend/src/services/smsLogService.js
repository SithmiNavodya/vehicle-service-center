import axios from 'axios';

const API_URL = 'http://localhost:8080/api/sms-logs';

const smsLogService = {
  // Get all SMS logs
  getAllSmsLogs: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get SMS logs by status
  getSmsLogsByStatus: async (status) => {
    try {
      const response = await axios.get(`${API_URL}/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get SMS statistics
  getSmsStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search SMS logs
  searchSmsLogs: async (searchTerm) => {
    try {
      const response = await axios.get(`${API_URL}/search?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Resend failed SMS
  resendSms: async (smsId) => {
    try {
      const response = await axios.post(`${API_URL}/resend/${smsId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default smsLogService;