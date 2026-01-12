import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, apiNoPrefix } from '../services/api';  // Make sure this path is correct

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Only set header if token exists
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Only set for apiNoPrefix if it exists
          if (apiNoPrefix && apiNoPrefix.defaults) {
            apiNoPrefix.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });

      // Check which endpoint works - try different paths
      let response;
      try {
        // Try with apiNoPrefix first
        response = await apiNoPrefix.post('/api/auth/login', { email, password });
      } catch (err) {
        // Fallback to regular api instance
        response = await api.post('/auth/login', { email, password });
      }

      console.log('Login response:', response.data);

      if (response.data.token) {
        const userData = {
          token: response.data.token,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: response.data.role || 'USER'
        };

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        // Set headers
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        if (apiNoPrefix && apiNoPrefix.defaults) {
          apiNoPrefix.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }

        navigate('/dashboard');
        return { success: true };
      } else {
        return {
          success: false,
          error: response.data.message || 'Login failed. No token received.'
        };
      }
    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = 'Login failed. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.message ||
                      `Server error: ${error.response.status}`;
      }

      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration:', userData);

      let response;
      try {
        // Try different endpoint paths
        response = await apiNoPrefix.post('/api/auth/register', userData);
      } catch (err) {
        response = await api.post('/auth/register', userData);
      }

      console.log('Register response:', response.data);

      if (response.data.token) {
        const newUser = {
          token: response.data.token,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: response.data.role || 'USER'
        };

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);

        // Set headers
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        if (apiNoPrefix && apiNoPrefix.defaults) {
          apiNoPrefix.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }

        navigate('/dashboard');
        return { success: true };
      } else {
        return {
          success: false,
          error: response.data.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message ||
               error.message ||
               'Registration failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    if (apiNoPrefix && apiNoPrefix.defaults) {
      delete apiNoPrefix.defaults.headers.common['Authorization'];
    }
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};