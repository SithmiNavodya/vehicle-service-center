import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, apiNoPrefix } from '../services/api';  // Import both instances

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Set default authorization header for BOTH instances
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        apiNoPrefix.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });

      // Backend endpoint is /api/auth/login (not /api/v1/auth/login)
      const response = await apiNoPrefix.post('/api/auth/login', { email, password });
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

        // Set authorization header for BOTH instances
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        apiNoPrefix.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        navigate('/dashboard');
        return { success: true };
      } else {
        return {
          success: false,
          error: response.data.message || 'Login failed. No token received.'
        };
      }
    } catch (error) {
      console.error('Login error details:', error);

      let errorMessage = 'Login failed. Please try again.';
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message ||
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server. Check if backend is running.';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      console.log('Attempting registration:', userData);

      // Use apiNoPrefix for auth endpoints
      const response = await apiNoPrefix.post('/auth/register', userData);
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

        // Set authorization header for BOTH instances
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        apiNoPrefix.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

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

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    delete apiNoPrefix.defaults.headers.common['Authorization'];
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