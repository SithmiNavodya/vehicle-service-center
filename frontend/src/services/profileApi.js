// src/services/profileApi.js
import { api } from './api';

// Helper function to get user-specific storage key
const getProfileKey = (userId) => `userProfile_${userId}`;

// Migrate old profile data to new format
const migrateOldProfiles = () => {
  try {
    // Check if old profile exists
    const oldProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (oldProfile.id && user.email) {
      const userId = user.id || user.email || 'default';
      const newKey = getProfileKey(userId);

      // Only migrate if new profile doesn't exist
      if (!localStorage.getItem(newKey)) {
        // Add missing fields to old profile
        const migratedProfile = {
          ...oldProfile,
          userId: user.id || oldProfile.userId || 1,
          email: user.email || oldProfile.email || '',
          createdAt: oldProfile.createdAt || new Date().toISOString(),
          updatedAt: oldProfile.updatedAt || new Date().toISOString()
        };

        // Move old profile to user-specific key
        localStorage.setItem(newKey, JSON.stringify(migratedProfile));
        localStorage.removeItem('userProfile');

        console.log('✅ Migrated old profile to user-specific storage');
      }
    }
  } catch (error) {
    console.error('Error migrating profiles:', error);
  }
};

// Run migration on import
migrateOldProfiles();

// Clean up old profiles not belonging to current user
export const cleanupOldProfiles = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = user.id || user.email;

    if (!currentUserId) return;

    const currentUserKey = getProfileKey(currentUserId);

    // Get all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Remove old profile keys that don't belong to current user
      if (key.startsWith('userProfile_') && key !== currentUserKey) {
        localStorage.removeItem(key);
        console.log('🧹 Cleaned up old profile:', key);
      }
    }
  } catch (error) {
    console.error('Error cleaning up profiles:', error);
  }
};

export const profileApi = {
  // Get current user's profile
  getCurrentProfile: async () => {
    console.log('🔍 Fetching profile data...');

    // Try backend first
    try {
      console.log('🔄 Attempting to fetch from backend...');
      const response = await api.get('/profile/me');
      console.log('✅ Real profile data received:', response.data);

      // Save backend data to localStorage for offline use
      if (response.data) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || user.email || 'default';
        const profileKey = getProfileKey(userId);

        // Merge backend data with existing local data
        const existingProfile = JSON.parse(localStorage.getItem(profileKey) || '{}');
        const mergedProfile = {
          ...existingProfile,
          ...response.data,
          isFromBackend: true,
          lastSynced: new Date().toISOString()
        };

        localStorage.setItem(profileKey, JSON.stringify(mergedProfile));
        console.log('💾 Saved backend profile data locally');
      }

      return {
        success: true,
        data: response.data,
        fromBackend: true
      };
    } catch (error) {
      console.log('⚠️ Backend not available (status:', error.response?.status, '), using local data');
    }

    // Fallback to localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user.email || 'default';
    const profileKey = getProfileKey(userId);

    console.log('👤 Current user:', { email: user.email, id: user.id });
    console.log('🔑 Profile storage key:', profileKey);

    const savedProfile = JSON.parse(localStorage.getItem(profileKey) || '{}');
    console.log('📁 Saved profile for this user:', savedProfile);

    // If we have a saved profile for this user, return it
    if (savedProfile.id || savedProfile.email) {
      console.log('🎯 Returning saved profile for user');
      return {
        success: true,
        data: savedProfile,
        isMock: true
      };
    }

    // If no saved profile but we have user data, create a default profile
    if (user.email) {
      console.log('🆕 Creating new default profile for user');

      const defaultProfile = {
        id: Date.now(),
        userId: user.id || 1,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        phone: user.phone || '',
        address: '',
        city: '',
        role: user.role || 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save default profile
      localStorage.setItem(profileKey, JSON.stringify(defaultProfile));

      return {
        success: true,
        data: defaultProfile,
        isMock: true,
        isNew: true
      };
    }

    // Fallback: No user data at all
    console.warn('❌ No user data available, returning empty profile');
    return {
      success: true,
      data: {
        id: Date.now(),
        userId: 0,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      isMock: true,
      isEmpty: true
    };
  },

  // Update current user's profile
  updateProfile: async (profileData) => {
    console.log('📝 Updating profile with data:', profileData);

    // Try backend first
    try {
      console.log('🔄 Attempting to update on backend...');
      const response = await api.put('/profile/me', profileData);
      console.log('✅ Profile updated on backend:', response.data);

      // Also save to localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || user.email || 'default';
      const profileKey = getProfileKey(userId);

      const updatedProfile = {
        ...profileData,
        id: response.data.id || Date.now(),
        userId: user.id || 1,
        updatedAt: new Date().toISOString(),
        createdAt: response.data.createdAt || new Date().toISOString(),
        role: user.role || 'USER',
        isFromBackend: true,
        lastSynced: new Date().toISOString()
      };

      localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
      console.log('💾 Saved updated profile locally');

      // Update user info in localStorage
      if (user.email) {
        const updatedUser = {
          ...user,
          firstName: profileData.firstName || user.firstName,
          lastName: profileData.lastName || user.lastName,
          email: profileData.email || user.email,
          phone: profileData.phone || user.phone
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('👤 Updated user info in localStorage');
      }

      return {
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
        fromBackend: true
      };
    } catch (error) {
      console.log('⚠️ Backend update failed, saving locally only');
    }

    // Fallback: Save locally only
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user.email || 'default';
    const profileKey = getProfileKey(userId);

    // Get current profile to preserve some fields
    const currentProfile = JSON.parse(localStorage.getItem(profileKey) || '{}');

    const updatedProfile = {
      ...currentProfile,
      ...profileData,
      id: currentProfile.id || Date.now(),
      userId: user.id || 1,
      updatedAt: new Date().toISOString(),
      createdAt: currentProfile.createdAt || new Date().toISOString(),
      role: user.role || 'USER',
      isFromBackend: false
    };

    // Save to localStorage
    localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
    console.log('💾 Profile saved locally for user:', userId);

    // Update user info in localStorage
    if (user.email) {
      const updatedUser = {
        ...user,
        firstName: profileData.firstName || user.firstName,
        lastName: profileData.lastName || user.lastName,
        email: profileData.email || user.email,
        phone: profileData.phone || user.phone
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('👤 User info updated in localStorage');
    }

    return {
      success: true,
      message: 'Profile saved locally',
      data: updatedProfile,
      isMock: true
    };
  },

  // Get profile by user ID (admin only)
  getProfileById: async (userId) => {
    console.log('🔍 Getting profile for user ID:', userId);

    try {
      // Try backend first
      const response = await api.get(`/profile/user/${userId}`);
      return {
        success: true,
        data: response.data,
        fromBackend: true
      };
    } catch (error) {
      console.log('⚠️ Backend failed for profile by ID, checking local storage');
    }

    // Check local storage for this user
    const profileKey = getProfileKey(userId);
    const savedProfile = JSON.parse(localStorage.getItem(profileKey) || '{}');

    if (savedProfile.id) {
      return {
        success: true,
        data: savedProfile,
        isMock: true
      };
    }

    // Return empty profile if not found
    return {
      success: true,
      data: {
        id: Date.now(),
        userId: userId,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      isMock: true,
      isEmpty: true
    };
  },

  // Create profile (admin only)
  createProfile: async (userId, profileData) => {
    console.log('➕ Creating profile for user:', userId, profileData);

    try {
      const response = await api.post(`/profile/${userId}`, profileData);

      // Also save locally
      const profileKey = getProfileKey(userId);
      const createdProfile = {
        ...profileData,
        id: response.data.id || Date.now(),
        userId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(profileKey, JSON.stringify(createdProfile));

      return {
        success: true,
        data: createdProfile,
        fromBackend: true
      };
    } catch (error) {
      console.error('❌ Error creating profile:', error);

      // Create locally
      const profileKey = getProfileKey(userId);
      const createdProfile = {
        ...profileData,
        id: Date.now(),
        userId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(profileKey, JSON.stringify(createdProfile));

      return {
        success: true,
        message: 'Profile created locally',
        data: createdProfile,
        isMock: true
      };
    }
  },

  // Delete profile (admin only)
  deleteProfile: async (userId) => {
    console.log('🗑️ Deleting profile for user:', userId);

    try {
      await api.delete(`/profile/${userId}`);

      // Also delete from local storage
      const profileKey = getProfileKey(userId);
      localStorage.removeItem(profileKey);

      return {
        success: true,
        message: 'Profile deleted successfully',
        fromBackend: true
      };
    } catch (error) {
      console.error('❌ Error deleting profile:', error);

      // Delete locally
      const profileKey = getProfileKey(userId);
      localStorage.removeItem(profileKey);

      return {
        success: true,
        message: 'Profile deleted locally',
        isMock: true
      };
    }
  },

  // Get all profiles (admin only) - for debugging
  getAllProfiles: () => {
    const profiles = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('userProfile_')) {
        try {
          const profile = JSON.parse(localStorage.getItem(key) || '{}');
          profiles.push({
            key,
            ...profile
          });
        } catch (e) {
          console.error('Error parsing profile for key:', key, e);
        }
      }
    }

    return {
      success: true,
      data: profiles,
      count: profiles.length
    };
  },

  // Clear all profile data (for testing/debugging)
  clearAllProfiles: () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('userProfile_')) {
        localStorage.removeItem(key);
      }
    }

    // Also clear old 'userProfile' key
    localStorage.removeItem('userProfile');

    return {
      success: true,
      message: 'All local profiles cleared'
    };
  }
};

// Helper function to get current user's profile key
export const getCurrentUserProfileKey = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || user.email || 'default';
  return getProfileKey(userId);
};