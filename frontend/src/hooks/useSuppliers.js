// src/hooks/useSuppliers.js - CORRECTED VERSION
import { useState, useEffect } from 'react';
import { supplierService } from '../services/supplierService';
import { toast } from 'react-toastify';

const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching suppliers...');
      const data = await supplierService.getAllSuppliers();
      console.log('✅ Hook received suppliers:', data);
      console.log('📊 Type of data:', typeof data);
      console.log('📊 Is array?', Array.isArray(data));

      if (Array.isArray(data)) {
        setSuppliers(data);
        console.log(`✅ Set ${data.length} suppliers to state`);
      } else {
        console.warn('⚠️ Data is not an array:', data);
        setSuppliers([]);
      }
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching suppliers:', err);
      console.error('Error details:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch suppliers';
      setError(errorMsg);
      toast.error(`Fetch error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData) => {
    try {
      console.log('🔄 Creating supplier in hook:', supplierData);
      const newSupplier = await supplierService.createSupplier(supplierData);
      console.log('✅ Create response:', newSupplier);

      // Add new supplier to the list
      setSuppliers(prev => [...prev, newSupplier]);
      toast.success('Supplier created successfully!');
      return newSupplier;
    } catch (err) {
      console.error('❌ Error creating supplier:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create supplier';
      toast.error(`Create error: ${errorMsg}`);
      throw err;
    }
  };

  const updateSupplier = async (id, supplierData) => {
    try {
      console.log('🔄 Updating supplier in hook:', id, supplierData);
      const updatedSupplier = await supplierService.updateSupplier(id, supplierData);
      console.log('✅ Update response:', updatedSupplier);

      // Update supplier in the list
      setSuppliers(prev =>
        prev.map(supplier =>
          supplier.id === id ? updatedSupplier : supplier
        )
      );
      toast.success('Supplier updated successfully!');
      return updatedSupplier;
    } catch (err) {
      console.error('❌ Error updating supplier:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update supplier';
      toast.error(`Update error: ${errorMsg}`);
      throw err;
    }
  };

  const deleteSupplier = async (id) => {
    try {
      console.log('🗑️ Deleting supplier in hook:', id);
      await supplierService.deleteSupplier(id);

      // Remove supplier from the list
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      toast.success('Supplier deleted successfully!');
    } catch (err) {
      console.error('❌ Error deleting supplier:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete supplier';
      toast.error(`Delete error: ${errorMsg}`);
      throw err;
    }
  };

  const searchSuppliers = async (query) => {
    try {
      setLoading(true);
      const data = await supplierService.searchSuppliers(query);
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error searching suppliers:', err);
      toast.error('Failed to search suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    error,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers,
  };
};

export default useSuppliers;