package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.dto.AuthResponse;
import com.vsc.vehicle_service_backend.dto.LoginRequest;
import com.vsc.vehicle_service_backend.dto.RegisterRequest;
import com.vsc.vehicle_service_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            log.info("Register request: {}", request.getEmail());
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Register error", e);
            AuthResponse error = AuthResponse.builder()
                    .message("Server error: " + e.getMessage())
                    .build();
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            log.info("Login request: {}", request.getEmail());
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login error", e);
            AuthResponse error = AuthResponse.builder()
                    .message("Server error: " + e.getMessage())
                    .build();
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth endpoint working");
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth controller is healthy");
    }
}