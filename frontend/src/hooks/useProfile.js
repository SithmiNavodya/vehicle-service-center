// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { profileApi } from '../services/profileApi';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileApi.getCurrentProfile();
      if (response.success) {
        setProfile(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileApi.updateProfile(profileData);
      if (response.success) {
        setProfile(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  useEffect