import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { LoadingSpinner, SearchBar } from '../common/common';
import SupplierForm from './SupplierForm';
import SupplierCard from './SupplierCard';

const SupplierList = ({
  suppliers,
  loading,
  onSearch,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleFormSubmit = async (supplierData) => {
    try {
      if (editingSupplier) {
        await onUpdate(editingSupplier.id, supplierData);
      } else {
        await onCreate(supplierData);
      }
      setShowForm(false);
      setEditingSupplier(null);
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  if (loading) {
    return <LoadingSpinner text="Loading suppliers..." />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Suppliers</h2>
          <p className="text-gray-600">Manage your parts suppliers</p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <SearchBar
            onSearch={onSearch}
            placeholder="Search suppliers..."
          />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <Plus size={20} className="mr-2" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Total Suppliers</div>
          <div className="text-2xl font-bold text-blue-700">{suppliers.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Active Suppliers</div>
          <div className="text-2xl font-bold text-green-700">{suppliers.length}</div>
        </div>
      </div>

      {showForm && (
        <SupplierForm
          supplier={editingSupplier}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}

      {suppliers.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-16 w-16 text-gray-300 mx-auto mb-4">📞</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
          <p className="text-gray-500">Get started by adding your first supplier</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Add Supplier
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onEdit={() => handleEdit(supplier)}
              onDelete={() => onDelete(supplier.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplierList;