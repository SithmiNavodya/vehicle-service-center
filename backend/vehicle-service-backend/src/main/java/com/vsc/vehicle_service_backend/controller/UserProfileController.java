// src/main/java/com/vehicleservice/controller/UserProfileController.java
package com.vehicleservice.controller;

import com.vehicleservice.dto.UserProfileDTO;
import com.vehicleservice.dto.UpdateProfileRequest;
import com.vehicleservice.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/v1/profile")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<UserProfileDTO> getCurrentUserProfile() {
        UserProfileDTO profile = userProfileService.getCurrentUserProfile();
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable Long userId) {
        UserProfileDTO profile = userProfileService.getProfileByUserId(userId);
        return ResponseEntity.ok(profile);
    }

    // Update this method in UserProfileController.java
    @PutMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<UserProfileDTO> updateCurrentUserProfile(
            @Valid @RequestBody UpdateProfileRequest request) {

        // Get the current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Get user from database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        // Update the profile
        UserProfileDTO updatedProfile = userProfileService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileDTO> updateUserProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileDTO updatedProfile = userProfileService.updateProfile(userId, request);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileDTO> createUserProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileDTO createdProfile = userProfileService.createProfileForUser(userId, request);
        return ResponseEntity.status(201).body(createdProfile);
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUserProfile(@PathVariable Long userId) {
        userProfileService.deleteProfile(userId);
        return ResponseEntity.noContent().build();
    }
}