package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.dto.SparePartUsageRequest;
import com.vsc.vehicle_service_backend.dto.SparePartUsageResponse;
import com.vsc.vehicle_service_backend.service.SparePartUsageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/spare-part-usages")
@CrossOrigin(origins = "http://localhost:3000")
public class SparePartUsageController {

    @Autowired
    private SparePartUsageService usageService;

    @GetMapping
    public ResponseEntity<List<SparePartUsageResponse>> getAllUsages() {
        return ResponseEntity.ok(usageService.getAllUsages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SparePartUsageResponse> getUsageById(@PathVariable Long id) {
        return ResponseEntity.ok(usageService.getUsageById(id));
    }

    @PostMapping
    public ResponseEntity<SparePartUsageResponse> createUsage(@Valid @RequestBody SparePartUsageRequest request) {
        return ResponseEntity.ok(usageService.createUsage(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsage(@PathVariable Long id) {
        usageService.deleteUsage(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/chart-data/{categoryId}")
    public ResponseEntity<?> getUsageChartData(@PathVariable Long categoryId) {
        return ResponseEntity.ok(usageService.getUsageChartData(categoryId));
    }

    @GetMapping("/stock-flow/{categoryId}")
    public ResponseEntity<?> getStockFlowData(@PathVariable Long categoryId) {
        return ResponseEntity.ok(usageService.getStockFlowData(categoryId));
    }
}