import { api } from './api';
const sparePartIncomeService = {
  // Get all income records - FIXED: removed duplicate /api/v1
  getAllIncomes: () => api.get('/api/v1/spare-part-incomes'),

  // Get income by ID
  getIncomeById: (id) => api.get(`/spare-part-incomes/${id}`),

  // Get pending incomes
  getPendingIncomes: () => api.get('/api/v1/spare-part-incomes/pending'),

  // Create new income
  createIncome: (incomeData) => api.post('/spare-part-incomes', incomeData),

  // Receive income
  receiveIncome: (id) => api.put(`/spare-part-incomes/${id}/receive`),

  // Cancel income
  cancelIncome: (id) => api.put(`/spare-part-incomes/${id}/cancel`),

  // Delete income
  deleteIncome: (id) => api.delete(`/spare-part-incomes/${id}`),

getChartData(categoryId) {
    // Updated to use proper endpoint
    return api.get(`/spare-part-incomes/chart?categoryId=${categoryId}`);
  }
//  // Get chart data by category
//  getChartData: (categoryId) => api.get(`/spare-part-incomes/chart-data/${categoryId}`),
};

export default sparePartIncomeService;