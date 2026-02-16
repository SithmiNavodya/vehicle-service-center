package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.dto.SparePartRequest;
import com.vsc.vehicle_service_backend.dto.SparePartResponse;
import com.vsc.vehicle_service_backend.service.SparePartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/spare-parts")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class SparePartController {

    private final SparePartService sparePartService;

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

    // REMOVED THE BROKEN METHODS - these were causing the errors
    // If you need chart data, create a separate ChartController or add to SparePartUsageController
}