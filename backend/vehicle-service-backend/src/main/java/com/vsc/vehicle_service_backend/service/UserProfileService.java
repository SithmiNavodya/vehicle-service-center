package com.vehicleservice.service;

import com.vehicleservice.dto.UserProfileDTO;
import com.vehicleservice.dto.UpdateProfileRequest;

public interface UserProfileService {
    UserProfileDTO getProfileByUserId(Long userId);
    UserProfileDTO getCurrentUserProfile();
    UserProfileDTO updateProfile(Long userId, UpdateProfileRequest request);
    UserProfileDTO createProfileForUser(Long userId, UpdateProfileRequest request);
    void deleteProfile(Long userId);
}