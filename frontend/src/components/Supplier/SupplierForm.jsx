import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SupplierForm = ({ supplier, onClose, onSubmit, nextSupplierCode }) => {
  const [formData, setFormData] = useState({
    supplierCode: '',
    supplierName: '',
    phone: '',
    email: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (supplier) {
      // Editing existing supplier - use existing code
      setFormData({
        supplierCode: supplier.supplierCode || '',
        supplierName: supplier.supplierName || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
      });
    } else {
      // New supplier - auto-generate code
      setFormData(prev => ({
        ...prev,
        supplierCode: nextSupplierCode || 'SUP_001', // Default if no next code
      }));
    }
  }, [supplier, nextSupplierCode]);

  const validate = () => {
    const newErrors = {};

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = 'Supplier name is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.phone && !/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    return newErrors;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsSubmitting(true);
  try {
    console.log('Form submitting data:', formData);
    console.log('Is editing?', !!supplier);
    console.log('Supplier ID if editing:', supplier?.id);

    await onSubmit(formData);
    onClose();
  } catch (error) {
    console.error('Error submitting form:', error);
    console.error('Error response:', error.response?.data);
    setErrors({
      submit: error.response?.data?.message || error.message || 'Failed to save supplier'
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Don't allow changes to supplierCode if editing
    if (supplier && name === 'supplierCode') {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          {/* Supplier Code - READ ONLY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Code {supplier ? '' : '(Auto-generated)'}
            </label>
            <input
              type="text"
              name="supplierCode"
              value={formData.supplierCode}
              readOnly
              className="input-field bg-gray-50 cursor-not-allowed"
              disabled={true}
            />
            <p className="mt-1 text-xs text-gray-500">
              {supplier ? 'Supplier code cannot be changed' : 'System will auto-generate code'}
            </p>
          </div>

          {/* Supplier Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Name *
            </label>
            <input
              type="text"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              className={`input-field ${errors.supplierName ? 'border-red-500' : ''}`}
              placeholder="AutoParts Lanka Ltd"
              disabled={isSubmitting}
            />
            {errors.supplierName && (
              <p className="mt-1 text-sm text-red-600">{errors.supplierName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="0112345678"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="orders@company.lk"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className={`input-field ${errors.address ? 'border-red-500' : ''}`}
              placeholder="No. 123, Galle Road, Colombo 03"
              disabled={isSubmitting}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {supplier ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                supplier ? 'Update Supplier' : 'Create Supplier'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;