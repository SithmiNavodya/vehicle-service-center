import { useState, useEffect, useCallback } from 'react';
import { vehicleServiceService } from '../services/vehicleServiceService';

export const useVehicleServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all services
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleServiceService.getAllServices();
      setServices(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new service
  const createService = async (serviceData) => {
    setLoading(true);
    setError(null);
    try {
      const newService = await vehicleServiceService.createService(serviceData);
      setServices(prev => [...prev, newService]);
      return newService;
    } catch (err) {
      setError(err.message || 'Failed to create service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update service
  const updateService = async (id, serviceData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedService = await vehicleServiceService.updateService(id, serviceData);
      setServices(prev => prev.map(service =>
        service.id === id ? updatedService : service
      ));
      return updatedService;
    } catch (err) {
      setError(err.message || 'Failed to update service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete service
  const deleteService = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await vehicleServiceService.deleteService(id);
      setServices(prev => prev.filter(service => service.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService
  };
};