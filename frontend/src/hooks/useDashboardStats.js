import { useState, useEffect } from 'react';
import { useCustomers } from './useCustomers';
import { useVehicles } from './useVehicles';
import { useVehicleServices }  from './useVehicleServices';
import useSuppliers from './useSuppliers';
import useSpareParts from './useSpareParts';

const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalVehicles: 0,
    activeServices: 0,
    totalInventory: 0,
    monthlyRevenue: 0,
    pendingServices: 0,
    completedServices: 0,
    cancelledServices: 0,
    totalSuppliers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use your existing hooks
  const {
    customers,
    loading: customersLoading,
    error: customersError
  } = useCustomers();

  const {
    vehicles,
    loading: vehiclesLoading,
    error: vehiclesError
  } = useVehicles();

  const {
    services,
    loading: servicesLoading,
    error: servicesError
  } = useVehicleServices();

  const {
    suppliers,
    loading: suppliersLoading,
    error: suppliersError
  } = useSuppliers();

  const {
    spareParts,
    loading: sparePartsLoading,
    error: sparePartsError
  } = useSpareParts();

  useEffect(() => {
    // Check if all data is loaded
    const isLoading = customersLoading || vehiclesLoading ||
                     servicesLoading || suppliersLoading || sparePartsLoading;

    const hasError = customersError || vehiclesError ||
                    servicesError || suppliersError || sparePartsError;

    if (!isLoading && !hasError) {
      try {
        // Calculate active services (services with status 'pending' or 'in_progress')
        const activeServices = services.filter(service =>
          ['pending', 'in_progress', 'active'].includes(service.status?.toLowerCase())
        ).length;

        // Calculate pending services
        const pendingServices = services.filter(service =>
          service.status?.toLowerCase() === 'pending'
        ).length;

        // Calculate completed services
        const completedServices = services.filter(service =>
          service.status?.toLowerCase() === 'completed'
        ).length;

        // Calculate cancelled services
        const cancelledServices = services.filter(service =>
          service.status?.toLowerCase() === 'cancelled'
        ).length;

        // Calculate monthly revenue (services completed this month)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = services
          .filter(service => {
            if (!service.completed_date) return false;
            const serviceDate = new Date(service.completed_date);
            return (
              service.status?.toLowerCase() === 'completed' &&
              serviceDate.getMonth() === currentMonth &&
              serviceDate.getFullYear() === currentYear &&
              service.total_price
            );
          })
          .reduce((sum, service) => sum + (parseFloat(service.total_price) || 0), 0);

        // Calculate total inventory value from spare parts
        const totalInventory = spareParts.reduce((sum, part) => {
          const stockValue = (part.stock_quantity || 0) * (part.unit_price || 0);
          return sum + stockValue;
        }, 0);

        // Calculate inventory item count
        const totalInventoryItems = spareParts.length;

        setStats({
          totalCustomers: customers.length,
          totalVehicles: vehicles.length,
          activeServices: activeServices,
          totalInventory: totalInventoryItems, // Number of items
          inventoryValue: totalInventory, // Total value
          monthlyRevenue: monthlyRevenue,
          pendingServices: pendingServices,
          completedServices: completedServices,
          cancelledServices: cancelledServices,
          totalSuppliers: suppliers.length,
        });
        setLoading(false);
      } catch (err) {
        setError('Error calculating dashboard statistics');
        setLoading(false);
      }
    }

    if (hasError) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  }, [
    customers, customersLoading, customersError,
    vehicles, vehiclesLoading, vehiclesError,
    services, servicesLoading, servicesError,
    suppliers, suppliersLoading, suppliersError,
    spareParts, sparePartsLoading, sparePartsError
  ]);

  return { stats, loading, error };
};

export default useDashboardStats;