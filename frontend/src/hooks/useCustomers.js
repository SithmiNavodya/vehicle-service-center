// src/hooks/useCustomers.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/customers`);
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch customers. Please check your backend.');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveCustomer = async (customerData) => {
    try {
      if (customerData.id) {
        // Update existing customer
        await axios.put(`${API_URL}/customers/${customerData.id}`, customerData);
      } else {
        // Add new customer
        await axios.post(`${API_URL}/customers`, customerData);
      }
      await fetchCustomers(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error saving customer:', err);
      alert('Failed to save customer. Please try again.');
      return false;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`${API_URL}/customers/${id}`);
      await fetchCustomers(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Failed to delete customer. Please try again.');
      return false;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    saveCustomer,
    deleteCustomer,
    fetchCustomers
  };
};