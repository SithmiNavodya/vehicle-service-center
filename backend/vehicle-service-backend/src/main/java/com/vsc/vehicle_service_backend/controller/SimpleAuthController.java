package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class SimpleAuthController {

    private final AuthService authService;

    @GetMapping("/check")
    public ResponseEntity<Map<String, String>> check() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Controller is working");
        response.put("authService", authService != null ? "INJECTED" : "NULL");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/simple-login")
    public ResponseEntity<Map<String, Object>> simpleLogin(@RequestBody Map<String, String> request) {
        System.out.println("Simple login called: " + request);

        Map<String, Object> response = new HashMap<>();
        response.put("token", "test-jwt-token-123");
        response.put("message", "Login successful (test)");
        response.put("email", request.get("email"));
        response.put("authService", authService != null ? "INJECTED" : "NULL");

        return ResponseEntity.ok(response);
    }
}