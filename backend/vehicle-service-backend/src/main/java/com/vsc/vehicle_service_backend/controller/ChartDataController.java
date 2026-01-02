// src/main/java/com/vsc/vehicle_service_backend/controller/ChartDataController.java
package com.vsc.vehicle_service_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/charts")
@CrossOrigin(origins = "http://localhost:3000")
public class ChartDataController {

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(Map.of(
                "totalSpareParts", 0,
                "totalCategories", 0,
                "totalSuppliers", 0,
                "lowStockItems", 0,
                "totalInventoryValue", 0.0
        ));
    }

    @GetMapping("/stock-status")
    public ResponseEntity<?> getStockStatusData() {
        return ResponseEntity.ok(Map.of(
                "lowStock", 0,
                "mediumStock", 0,
                "highStock", 0
        ));
    }
}