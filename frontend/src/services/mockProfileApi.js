// Mock profile data for testing
const mockProfile = {
  id: '1',
  userId: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main Street',
  city: 'New York',
  role: 'ADMIN',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-10T00:00:00.000Z',
};

export const mockProfileApi = {
  // Get current user's profile
  getCurrentProfile: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: 'Profile fetched successfully',
      data: mockProfile
    };
  },

  // Update current user's profile
  updateProfile: async (profileData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update mock data
    Object.assign(mockProfile, profileData, {
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Profile updated successfully',
      data: mockProfile
    };
  },
};