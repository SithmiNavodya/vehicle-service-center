// UserProfileDTO.java
package com.vsc.vehicle_service_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserProfileDTO {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String profileImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}