import React, { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import useSuppliers from '../../hooks/useSuppliers';
import { LoadingSpinner, SearchBar } from '../../components/common/common';
import SupplierForm from '../../components/Supplier/SupplierForm';
import SupplierCard from '../../components/Supplier/SupplierCard'; // Make sure this is imported

const SuppliersPage = () => {
  const {
    suppliers,
    loading,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers
  } = useSuppliers();

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [nextSupplierCode, setNextSupplierCode] = useState('');

  // Generate next supplier code
  useEffect(() => {
    if (suppliers && suppliers.length > 0) {
      // Extract numbers from existing codes (SUP_001 -> 1)
      const numbers = suppliers
        .map(s => {
          if (s.supplierCode && s.supplierCode.startsWith('SUP_')) {
            const numStr = s.supplierCode.substring(4);
            const num = parseInt(numStr);
            return isNaN(num) ? 0 : num;
          }
          return 0;
        })
        .filter(num => num > 0);

      const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
      const nextNumber = maxNumber + 1;
      const paddedNumber = nextNumber.toString().padStart(3, '0');
      setNextSupplierCode(`SUP_${paddedNumber}`);
    } else {
      setNextSupplierCode('SUP_001');
    }
  }, [suppliers]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      searchSuppliers(term);
    }
  };

  const handleCreateSupplier = async (supplierData) => {
    try {
      await createSupplier(supplierData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating supplier:', error);
    }
  };

  const handleUpdateSupplier = async (id, supplierData) => {
    try {
      await updateSupplier(id, supplierData);
      setEditingSupplier(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteSupplier(id);
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  // Filter suppliers based on search
  const filteredSuppliers = suppliers.filter(supplier => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      (supplier.supplierName && supplier.supplierName.toLowerCase().includes(searchLower)) ||
      (supplier.supplierCode && supplier.supplierCode.toLowerCase().includes(searchLower)) ||
      (supplier.email && supplier.email.toLowerCase().includes(searchLower)) ||
      (supplier.phone && supplier.phone.includes(searchTerm))
    );
  });

  if (loading) {
    return <LoadingSpinner text="Loading suppliers..." />;
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Suppliers ({suppliers.length})</h1>
          <p className="text-gray-600">Manage your suppliers and purchase orders</p>
          {nextSupplierCode && (
            <p className="text-sm text-gray-500 mt-1">
              Next supplier code: <span className="font-semibold text-blue-600">{nextSupplierCode}</span>
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search suppliers by name, code, email, or phone..."
        />
      </div>

      {/* Supplier Form Modal */}
      {(showForm || editingSupplier) && (
        <SupplierForm
          supplier={editingSupplier}
          nextSupplierCode={nextSupplierCode}
          onClose={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
          onSubmit={editingSupplier ?
            (data) => handleUpdateSupplier(editingSupplier.id, data) :
            handleCreateSupplier
          }
        />
      )}

      {/* Suppliers Grid - USING SupplierCard COMPONENT */}
      {filteredSuppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map(supplier => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onEdit={() => setEditingSupplier(supplier)}
              onDelete={() => handleDeleteSupplier(supplier.id)}
            />
          ))}
        </div>
      ) : suppliers.length > 0 ? (
        // No results from search
        <div className="card text-center py-12">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No suppliers found</h3>
          <p className="text-gray-600 mb-4">
            No suppliers match "{searchTerm}"
          </p>
        </div>
      ) : (
        // No suppliers at all
        <div className="card text-center py-12">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No suppliers yet</h3>
          <p className="text-gray-600 mb-4">
            Get started by adding your first supplier
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Supplier
          </button>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;