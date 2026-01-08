package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.repository.UserRepository;
import com.vsc.vehicle_service_backend.security.JwtUtil;
import com.vsc.vehicle_service_backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired(required = false)
    private AuthService authService;

    @Autowired(required = false)
    private UserRepository userRepository;

    @Autowired(required = false)
    private JwtUtil jwtUtil;

    @Autowired(required = false)
    private PasswordEncoder passwordEncoder;

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();

        // Check basic status
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis());

        // Check bean injections
        Map<String, String> beans = new HashMap<>();
        beans.put("authService", authService != null ? "INJECTED" : "NULL");
        beans.put("userRepository", userRepository != null ? "INJECTED" : "NULL");
        beans.put("jwtUtil", jwtUtil != null ? "INJECTED" : "NULL");
        beans.put("passwordEncoder", passwordEncoder != null ? "INJECTED" : "NULL");

        response.put("beans", beans);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/simple")
    public ResponseEntity<String> simple() {
        return ResponseEntity.ok("Server is running!");
    }
}