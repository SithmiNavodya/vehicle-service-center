// src/services/sparePartIncomeService.js
import { api } from './api';

        const sparePartIncomeService = {
// Get all income records
getAllIncomes: async () => {
        try {
        const response = await api.get('/spare-part-incomes');
      return response.data;
    } catch (error) {
        console.error('Error fetching all incomes:', error);
      throw error;
    }
            },

// Get income by ID
getIncomeById: async (id) => {
        try {
        const response = await api.get(`/spare-part-incomes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching income:', error);
      throw error;
    }
            },

// Get pending incomes
getPendingIncomes: async () => {
        try {
        const response = await api.get('/spare-part-incomes/pending');
      return response.data;
    } catch (error) {
        console.error('Error fetching pending incomes:', error);
      throw error;
    }
            },

// Create new income
createIncome: async (incomeData) => {
        try {
        const response = await api.post('/spare-part-incomes', incomeData);
      return response.data;
    } catch (error) {
        console.error('Error creating income:', error);
      throw error;
    }
            },

// Receive income
receiveIncome: async (id) => {
        try {
        const response = await api.put(`/spare-part-incomes/${id}/receive`);
        return response.data;
    } catch (error) {
        console.error('Error receiving income:', error);
      throw error;
    }
            },

// Cancel income
cancelIncome: async (id) => {
        try {
        const response = await api.put(`/spare-part-incomes/${id}/cancel`);
        return response.data;
    } catch (error) {
        console.error('Error canceling income:', error);
      throw error;
    }
            },

// Delete income
deleteIncome: async (id) => {
        try {
        const response = await api.delete(`/spare-part-incomes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting income:', error);
      throw error;
    }
            },

// Get chart data by category
getChartData: async (categoryId) => {
        try {
        const response = await api.get(`/spare-part-incomes/chart-data/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chart data:', error);
      throw error;
    }
            }
            };

export default sparePartIncomeService;