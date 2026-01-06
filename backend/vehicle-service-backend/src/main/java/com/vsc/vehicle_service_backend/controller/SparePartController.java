package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.dto.SparePartRequest;
import com.vsc.vehicle_service_backend.dto.SparePartResponse;
import com.vsc.vehicle_service_backend.service.SparePartService;
// REMOVE THESE METHODS OR FIX THEM
// import com.vsc.vehicle_service_backend.service.SparePartUsageService; // If you have this service
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/spare-parts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SparePartController {

    private final SparePartService sparePartService;
    // private final SparePartUsageService usageService; // Uncomment if you create this service

    @GetMapping
    public ResponseEntity<List<SparePartResponse>> getAllSpareParts() {
        return ResponseEntity.ok(sparePartService.getAllSpareParts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SparePartResponse> getSparePartById(@PathVariable Long id) {
        return ResponseEntity.ok(sparePartService.getSparePartById(id));
    }

    @PostMapping
    public ResponseEntity<SparePartResponse> createSparePart(@Valid @RequestBody SparePartRequest request) {
        return new ResponseEntity<>(sparePartService.createSparePart(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SparePartResponse> updateSparePart(
            @PathVariable Long id,
            @Valid @RequestBody SparePartRequest request) {
        return ResponseEntity.ok(sparePartService.updateSparePart(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSparePart(@PathVariable Long id) {
        sparePartService.deleteSparePart(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<SparePartResponse>> getSparePartsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(sparePartService.getSparePartsByCategory(categoryId));
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<SparePartResponse>> getSparePartsBySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(sparePartService.getSparePartsBySupplier(supplierId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<SparePartResponse>> searchSpareParts(@RequestParam String q) {
        // TODO: Implement search logic in service
        return ResponseEntity.ok(sparePartService.getAllSpareParts());
    }

    // TEMPORARILY COMMENT OUT OR REMOVE THESE METHODS
    /*
    @GetMapping("/chart-data/{categoryId}")
    public ResponseEntity<?> getUsageChartData(@PathVariable Long categoryId) {
        return ResponseEntity.ok(usageService.getUsageChartData(categoryId));
    }

    @GetMapping("/stock-flow/{categoryId}")
    public ResponseEntity<?> getStockFlowData(@PathVariable Long categoryId) {
        return ResponseEntity.ok(usageService.getStockFlowData(categoryId));
    }
    */
}