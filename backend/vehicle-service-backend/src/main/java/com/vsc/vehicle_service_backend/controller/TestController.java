package com.vsc.vehicle_service_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/cors")
    public ResponseEntity<String> testCors() {
        return ResponseEntity.ok("CORS is working! Request from React frontend should succeed.");
    }
}