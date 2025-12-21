package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.dto.SparePartCategoryRequest;
import com.vsc.vehicle_service_backend.dto.SparePartCategoryResponse;
import com.vsc.vehicle_service_backend.service.SparePartCategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/spare-part-categories")
@Validated
public class SparePartCategoryController {

    @Autowired
    private SparePartCategoryService categoryService;

    @PostMapping
    public ResponseEntity<SparePartCategoryResponse> createCategory(
            @Valid @RequestBody SparePartCategoryRequest request) {
        SparePartCategoryResponse response = categoryService.createCategory(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SparePartCategoryResponse> getCategoryById(@PathVariable Long id) {
        SparePartCategoryResponse response = categoryService.getCategoryById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/code/{categoryCode}")
    public ResponseEntity<SparePartCategoryResponse> getCategoryByCode(
            @PathVariable String categoryCode) {
        SparePartCategoryResponse response = categoryService.getCategoryByCode(categoryCode);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SparePartCategoryResponse>> getAllCategories() {
        List<SparePartCategoryResponse> responses = categoryService.getAllCategories();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SparePartCategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody SparePartCategoryRequest request) {
        SparePartCategoryResponse response = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exists/code/{categoryCode}")
    public ResponseEntity<Boolean> checkCategoryCodeExists(@PathVariable String categoryCode) {
        boolean exists = categoryService.existsByCategoryCode(categoryCode);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/exists/name/{categoryName}")
    public ResponseEntity<Boolean> checkCategoryNameExists(@PathVariable String categoryName) {
        boolean exists = categoryService.existsByCategoryName(categoryName);
        return ResponseEntity.ok(exists);
    }
}