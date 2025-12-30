package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.dto.SparePartRequest;
import com.vsc.vehicle_service_backend.dto.SparePartResponse;
import com.vsc.vehicle_service_backend.service.SparePartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/spare-parts")
@CrossOrigin(origins = "http://localhost:3000")
public class SparePartController {

    @Autowired
    private SparePartService sparePartService;

    @GetMapping
    public ResponseEntity<List<SparePartResponse>> getAllSpareParts() {
        return ResponseEntity.ok(sparePartService.getAllSpareParts());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<SparePartResponse>> getLowStockParts() {
        return ResponseEntity.ok(sparePartService.getLowStockParts());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<SparePartResponse>> getPartsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(sparePartService.getPartsByCategory(categoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SparePartResponse> getPartById(@PathVariable Long id) {
        return ResponseEntity.ok(sparePartService.getPartById(id));
    }

    @PostMapping
    public ResponseEntity<SparePartResponse> createSparePart(@Valid @RequestBody SparePartRequest request) {
        return ResponseEntity.ok(sparePartService.createSparePart(request));
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

    @GetMapping("/stock-report")
    public ResponseEntity<Map<String, Object>> getStockReport() { // Changed return type
        return ResponseEntity.ok(sparePartService.getStockReport());
    }
}