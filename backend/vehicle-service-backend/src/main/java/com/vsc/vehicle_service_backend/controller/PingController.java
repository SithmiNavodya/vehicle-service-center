package com.vsc.vehicle_service_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {

    @GetMapping("/ping")
    public String ping() {
        System.out.println("Ping endpoint called");
        return "pong";
    }
}