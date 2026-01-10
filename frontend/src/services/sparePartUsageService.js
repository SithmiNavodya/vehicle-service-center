import { api } from './api';
export const sparePartUsageService = {
  getAllUsage() {
    return api.get('/spare-part-usages');
  },

  getUsageById(id) {
    return api.get(`/spare-part-usages/${id}`);
  },

  createUsage(usageData) {
    return api.post('/spare-part-usages', usageData);
  },

  deleteUsage(id) {
    return api.delete(`/spare-part-usages/${id}`);
  },

  getUsageChartData(categoryId) {
    return api.get(`/spare-part-usages/chart-data/${categoryId}`);
  },

  getStockFlowData(categoryId) {
    return api.get(`/spare-part-usages/stock-flow/${categoryId}`);
  },

  getUsageByVehicle(vehicleId) {
    return api.get(`/spare-part-usages/vehicle/${vehicleId}`);
  },
};