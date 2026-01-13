
import axios from 'axios';

// Base URL configuration
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Base API instance (for /api/v1/* endpoints)
export const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For endpoints without /api/v1 prefix (like auth)
export const apiNoPrefix = axios.create({
  baseURL: BASE_URL,  // Just the base URL, no /api/v1
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Apply interceptors to both instances
const setupInterceptors = (instance) => {
  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};

// Setup interceptors for both instances
setupInterceptors(api);
setupInterceptors(apiNoPrefix);