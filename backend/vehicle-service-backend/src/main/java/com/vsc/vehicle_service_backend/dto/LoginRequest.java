// LoginRequest.java
package com.vsc.vehicle_service_backend.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}