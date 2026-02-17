import { useState, useEffect, useCallback } from 'react';
import serviceRecordService from '../services/serviceRecordService';

export const useServiceRecords = () => {
  const [serviceRecords, setServiceRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all service records
  const fetchServiceRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await serviceRecordService.getAllServiceRecords();
      setServiceRecords(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch service records');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch service records by vehicle ID
  //  const fetchServiceRecordsByVehicle = useCallback(async (vehicleId) => {
  //    setLoading(true);
  //    setError(null);
  //    try {
  //      const data = await serviceRecordService.getServiceRecordsByVehicleId(vehicleId);
  //      return data;
  //    } catch (err) {
  //      setError(err.message || 'Failed to fetch service records');
  //      throw err;
  //    } finally {
  //      setLoading(false);
  //    }
  //  }, []);


  // Fetch service records by vehicle ID - FIXED VERSION
  const fetchServiceRecordsByVehicle = useCallback(async (vehicleId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useServiceRecords] Fetching records for vehicleId:', vehicleId);

      // Ensure numeric ID
      const id = Number(vehicleId);
      if (isNaN(id)) {
        console.error('[useServiceRecords] Invalid vehicleId:', vehicleId);
        return [];
      }

      const data = await serviceRecordService.getServiceRecordsByVehicleId(id);
      console.log('[useServiceRecords] API Response:', data);

      // Enrich the data with service and vehicle details
      const enrichedData = data.map(record => {
        const service = services.find(s => s.id === record.serviceId);
        return {
          ...record,
          service: service || null,
          serviceName: service ? (service.serviceName || service.name) : 'Standard Service',
          // Ensure vehicleId is properly set for filtering if needed
          vehicleId: record.vehicleId || id
        };
      });

      console.log('[useServiceRecords] Enriched Records:', enrichedData);
      return enrichedData;
    } catch (err) {
      console.error('[useServiceRecords] Error fetching records:', err);
      setError(err.message || 'Failed to fetch service records');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [services]);


  // Fetch all vehicles
  const fetchVehicles = useCallback(async () => {
    try {
      const data = await serviceRecordService.getAllVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    }
  }, []);

  // Fetch all services
  const fetchServices = useCallback(async () => {
    try {
      const data = await serviceRecordService.getAllServices();
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  }, []);

  // Create new service record
  const createServiceRecord = async (serviceRecordData) => {
    setLoading(true);
    setError(null);
    try {
      const newRecord = await serviceRecordService.createServiceRecord(serviceRecordData);
      setServiceRecords(prev => [...prev, newRecord]);
      return newRecord;
    } catch (err) {
      setError(err.message || 'Failed to create service record');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update service record
  const updateServiceRecord = async (id, serviceRecordData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRecord = await serviceRecordService.updateServiceRecord(id, serviceRecordData);
      setServiceRecords(prev => prev.map(record =>
        record.id === id ? updatedRecord : record
      ));
      return updatedRecord;
    } catch (err) {
      setError(err.message || 'Failed to update service record');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update status
  const updateStatus = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRecord = await serviceRecordService.updateStatus(id, status);
      setServiceRecords(prev => prev.map(record =>
        record.id === id ? updatedRecord : record
      ));
      return updatedRecord;
    } catch (err) {
      setError(err.message || 'Failed to update status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete service record
  const deleteServiceRecord = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await serviceRecordService.deleteServiceRecord(id);
      setServiceRecords(prev => prev.filter(record => record.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete service record');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //useEffect(() => {
  //  if (serviceRecords.length > 0) {
  //    console.log('First service record:', serviceRecords[0]);
  //    console.log('All service records:', serviceRecords);
  //  } else {
  //    console.log('No service records found');
  //  }
  //}, [serviceRecords]);


  useEffect(() => {
    console.log('[useServiceRecords] Lifecycle: Initiating data fetch...');
    fetchServiceRecords();
    fetchVehicles();
    fetchServices();
  }, [fetchServiceRecords, fetchVehicles, fetchServices]);

  return {
    serviceRecords,
    vehicles,
    services,
    loading,
    error,
    fetchServiceRecords,
    fetchServiceRecordsByVehicle,
    fetchVehicles,
    fetchServices,
    createServiceRecord,
    updateServiceRecord,
    updateStatus,
    deleteServiceRecord
  };
};