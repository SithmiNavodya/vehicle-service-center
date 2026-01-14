package com.vehicleservice.dto;

import lombok.Data;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
    private String phone;

    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String address;

    @Size(max = 50, message = "City cannot exceed 50 characters")
    private String city;
}