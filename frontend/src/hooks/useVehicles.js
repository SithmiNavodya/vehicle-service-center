import { useState, useEffect, useCallback } from 'react';
import vehicleService from '../services/vehicleService';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all vehicles
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all customers
  const fetchCustomers = useCallback(async () => {
    try {
      const data = await vehicleService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  }, []);

  // Create new vehicle
  const createVehicle = async (vehicleData) => {
    setLoading(true);
    setError(null);
    try {
      const newVehicle = await vehicleService.createVehicle(vehicleData);
      setVehicles(prev => [...prev, newVehicle]);
      return newVehicle;
    } catch (err) {
      setError(err.message || 'Failed to create vehicle');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update vehicle
  const updateVehicle = async (id, vehicleData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useVehicles] >>> UPDATE START');
      console.log('[useVehicles] Target ID:', id, '(', typeof id, ')');
      console.log('[useVehicles] Payload to Service:', vehicleData);

      const updated = await vehicleService.updateVehicle(id, vehicleData);
      console.log('[useVehicles] API Response Recieved:', updated);

      setVehicles(prev => {
        const found = prev.some(v => v.id === id);
        console.log('[useVehicles] Pre-Update State Size:', prev.length, 'Target Found?', found);
        const newList = prev.map(v => v.id === id ? updated : v);
        return newList;
      });
      return updated;
    } catch (err) {
      console.error('[useVehicles] UPDATE FAILED:', err);
      setError(err.message || 'Failed to update vehicle');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete vehicle
  const deleteVehicle = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await vehicleService.deleteVehicle(id);
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete vehicle');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchCustomers();
  }, [fetchVehicles, fetchCustomers]);

  return {
    vehicles,
    customers,
    loading,
    error,
    fetchVehicles,
    fetchCustomers,
    createVehicle,
    updateVehicle,
    deleteVehicle
  };
};