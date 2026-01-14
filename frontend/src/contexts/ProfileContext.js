// src/contexts/ProfileContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { profileApi ,cleanupOldProfiles  } from '../services/profileApi';
import { useAuth } from './AuthContext';
//import { ProfileProvider } from './contexts/ProfileContext';
import { mockProfileApi } from '../services/mockProfileApi';


const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await profileApi.getCurrentProfile();
      if (response.success) {
        setProfile(response.data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
      setProfile(null);
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
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const clearProfile = () => {
    setProfile(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      console.log('User changed, fetching profile...');

      // Clean up old profiles before fetching
      cleanupOldProfiles();

      fetchProfile();
    } else {
      console.log('No user, clearing profile...');
      clearProfile();
    }
  }, [user]);

  const value = {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    clearProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};