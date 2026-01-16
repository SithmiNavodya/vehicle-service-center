package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.dto.UserProfileDTO;
import com.vsc.vehicle_service_backend.dto.UpdateProfileRequest;

public interface UserProfileService {
    UserProfileDTO getProfileByUserId(Long userId);
    UserProfileDTO getCurrentUserProfile();
    UserProfileDTO updateProfile(Long userId, UpdateProfileRequest request);
    UserProfileDTO createProfileForUser(Long userId, UpdateProfileRequest request);
    void deleteProfile(Long userId);
}