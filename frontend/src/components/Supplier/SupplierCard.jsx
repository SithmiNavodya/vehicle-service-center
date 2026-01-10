import { Building2, Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

const SupplierCard = ({ supplier, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${supplier.supplier_name || supplier.supplierName}?`)) {
      onDelete();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

 return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-5">
        {/* Header with logo and buttons */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{supplier.supplierName}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {supplier.supplierCode}
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Edit"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          {supplier.phone && (
            <div className="flex items-center text-gray-600">
              <Phone size={16} className="mr-2 text-gray-400" />
              <span>{supplier.phone}</span>
            </div>
          )}

          {supplier.email && (
            <div className="flex items-center text-gray-600">
              <Mail size={16} className="mr-2 text-gray-400" />
              <span className="truncate">{supplier.email}</span>
            </div>
          )}

          {supplier.address && (
            <div className="flex items-start text-gray-600">
              <MapPin size={16} className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
              <span className="text-sm">{supplier.address}</span>
            </div>
          )}
        </div>

        {/* Footer with dates */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
          <div>
            Created: <span className="font-medium">
              {formatDate(supplier.createdAt)}
            </span>
          </div>
          {supplier.updatedAt && supplier.updatedAt !== supplier.createdAt && (
            <div>
              Updated: <span className="font-medium">
                {formatDate(supplier.updatedAt)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;