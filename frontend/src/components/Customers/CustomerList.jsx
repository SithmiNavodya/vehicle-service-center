// src/components/Customers/CustomerList.jsx
import { Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react';

const CustomerList = ({ customers, onEdit, onDelete }) => {
  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={36} className="text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No customers found</h3>
        <p className="text-gray-500">Start by adding your first customer</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Contact Info</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Address</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{customer.name}</div>
                      <div className="text-sm text-gray-500">ID: {customer.id}</div>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-gray-700">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-gray-700">{customer.phone}</span>
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="py-4 px-6">
                  {customer.address ? (
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-gray-400 mt-1" />
                      <span className="text-gray-700">{customer.address}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </td>
                
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(customer)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(customer.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;