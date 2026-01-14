// UserProfileServiceImpl.java
package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.dto.UserProfileDTO;
import com.vsc.vehicle_service_backend.dto.UpdateProfileRequest;
import com.vsc.vehicle_service_backend.entity.UserProfile;
import com.vsc.vehicle_service_backend.entity.User;
import com.vsc.vehicle_service_backend.exception.ResourceNotFoundException;
import com.vsc.vehicle_service_backend.exception.DuplicateResourceException;
import com.vsc.vehicle_service_backend.repository.UserProfileRepository;
import com.vsc.vehicle_service_backend.repository.UserRepository;
import com.vsc.vehicle_service_backend.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    @Override
    public UserProfileDTO getProfileByUserId(Long userId) {
        log.info("Getting profile for user ID: {}", userId);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user id: " + userId));

        return mapToDTO(profile);
    }

    @Override
    public UserProfileDTO getCurrentUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            log.info("Getting profile for authenticated user: {}", username);

            // Try to find user by email (which is the username in JWT)
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + username));

            log.info("Found user: ID={}, Email={}", user.getId(), user.getEmail());

            // Try to find existing profile
            Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(user.getId());

            if (profileOpt.isPresent()) {
                log.info("Existing profile found");
                return mapToDTO(profileOpt.get());
            } else {
                log.info("Creating new profile for user");
                // Create new profile
                UserProfile newProfile = new UserProfile();
                newProfile.setUser(user);
                newProfile.setFirstName(user.getFirstName());
                newProfile.setLastName(user.getLastName());
                newProfile.setEmail(user.getEmail());
                newProfile.setPhone(user.getPhone());

                UserProfile savedProfile = userProfileRepository.save(newProfile);
                log.info("New profile created with ID: {}", savedProfile.getId());
                return mapToDTO(savedProfile);
            }

        } catch (Exception e) {
            log.error("Error in getCurrentUserProfile: ", e);
            throw new RuntimeException("Failed to get user profile: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public UserProfileDTO updateProfile(Long userId, UpdateProfileRequest request) {
        log.info("Updating profile for user ID: {}", userId);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user id: " + userId));

        // Check if email is already taken by another user
        if (userProfileRepository.existsByEmailAndIdNot(request.getEmail(), profile.getId())) {
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
        }

        // Update profile fields
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());

        // Update user email if it's different
        User user = profile.getUser();
        if (user != null && !user.getEmail().equals(request.getEmail())) {
            user.setEmail(request.getEmail());
            userRepository.save(user);
        }

        UserProfile updatedProfile = userProfileRepository.save(profile);
        return mapToDTO(updatedProfile);
    }

    @Override
    @Transactional
    public UserProfileDTO createProfileForUser(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if profile already exists
        if (userProfileRepository.findByUserId(userId).isPresent()) {
            throw new DuplicateResourceException("Profile already exists for user id: " + userId);
        }

        // Check if email is already taken
        if (userProfileRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email already in use: " + request.getEmail());
        }

        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());

        // Update user email
        user.setEmail(request.getEmail());
        userRepository.save(user);

        UserProfile savedProfile = userProfileRepository.save(profile);
        return mapToDTO(savedProfile);
    }

    @Override
    @Transactional
    public void deleteProfile(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user id: " + userId));

        userProfileRepository.delete(profile);
    }

    private UserProfileDTO mapToDTO(UserProfile profile) {
        if (profile == null) {
            return null;
        }

        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser() != null ? profile.getUser().getId() : null);
        dto.setFirstName(profile.getFirstName());
        dto.setLastName(profile.getLastName());
        dto.setEmail(profile.getEmail());
        dto.setPhone(profile.getPhone());
        dto.setAddress(profile.getAddress());
        dto.setCity(profile.getCity());
        dto.setProfileImageUrl(profile.getProfileImageUrl());
        dto.setCreatedAt(profile.getCreatedAt());
        dto.setUpdatedAt(profile.getUpdatedAt());
        return dto;
    }
}