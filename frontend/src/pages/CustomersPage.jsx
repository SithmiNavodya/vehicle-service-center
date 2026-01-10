// src/pages/CustomersPage.jsx
import { useState } from 'react';
import CustomerList from '../components/Customers/CustomerList';
import CustomerForm from '../components/Customers/CustomerForm';
import { Users, Plus, Search } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers';

const CustomersPage = () => {
  const { customers, loading, saveCustomer, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setIsFormOpen(true);
  };

  const handleSave = async (customerData) => {
    await saveCustomer(customerData);
    setIsFormOpen(false);
    setEditCustomer(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            Customer Management
          </h1>
          <p className="text-gray-600 mt-2">Manage all your service customers</p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      {/* Customer List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <CustomerList
          customers={filteredCustomers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Popup Form */}
      {isFormOpen && (
        <CustomerForm
          customer={editCustomer}
          onSave={handleSave}
          onClose={() => {
            setIsFormOpen(false);
            setEditCustomer(null);
          }}
        />
      )}
    </div>
  );
};

export default CustomersPage;