// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { useAuth } from '../contexts/AuthContext';
import { profileApi } from '../services/profileApi';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';

const ProfilePage = () => {
  const { profile, loading, error, updateProfile } = useProfile();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setUpdateSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setUpdateSuccess(''), 3000);
      } else {
        setUpdateError(result.error);
      }
    } catch (err) {
      setUpdateError('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
      });
    }
    setIsEditing(false);
    setUpdateError('');
    setUpdateSuccess('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Profile Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-gray-600">Please contact support if this issue persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      {/* Messages */}
      {updateError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700">{updateError}</p>
        </div>
      )}

      {updateSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-700">{updateSuccess}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="text-white text-center md:text-left">
              <h2 className="text-2xl font-bold">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-blue-100 mt-1">{profile?.email}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(profile?.createdAt).toLocaleDateString()}</span>
                </div>
                {profile?.role && (
                  <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {profile.role}
                  </div>
                )}
              </div>
            </div>
            <div className="md:ml-auto mt-4 md:mt-0">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form/Info */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4" />
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              ) : (
                <p className="text-gray-900 text-lg font-medium">{profile?.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4" />
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              ) : (
                <p className="text-gray-900 text-lg font-medium">{profile?.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              ) : (
                <p className="text-gray-900 text-lg font-medium">{profile?.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              ) : (
                <p className="text-gray-900 text-lg font-medium">{profile?.phone || 'Not provided'}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4" />
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="123 Main Street"
                />
              ) : (
                <p className="text-gray-900 text-lg font-medium">{profile?.address || 'Not provided'}</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4" />
                City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="New York"
                />
              ) : (
                <p className="text-gray-900 text-lg font-medium">{profile?.city || 'Not provided'}</p>
              )}
            </div>

            {/* User ID (Read Only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">User ID</label>
              <p className="text-gray-900 text-lg font-mono">{profile?.userId || user?.id}</p>
            </div>
          </div>

          {/* Last Updated */}
          {profile?.updatedAt && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: {new Date(profile.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Account Information */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Account Status</p>
            <p className="font-medium text-green-600">Active</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-medium">{new Date(profile?.createdAt || user?.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">User Role</p>
            <p className="font-medium capitalize">{user?.role || 'User'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Profile Status</p>
            <p className="font-medium">{profile ? 'Complete' : 'Incomplete'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;