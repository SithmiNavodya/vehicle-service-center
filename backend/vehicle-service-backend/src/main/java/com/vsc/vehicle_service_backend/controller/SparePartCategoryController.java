package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.entity.SparePartCategory;
import com.vsc.vehicle_service_backend.service.SparePartCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/spare-part-categories")
@CrossOrigin(origins = "http://localhost:3000")
public class SparePartCategoryController {

    @Autowired
    private SparePartCategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<SparePartCategory>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SparePartCategory> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<SparePartCategory> createCategory(@RequestBody SparePartCategory category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SparePartCategory> updateCategory(
            @PathVariable Long id,
            @RequestBody SparePartCategory category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<SparePartCategory>> searchCategories(@RequestParam String q) {
        return ResponseEntity.ok(categoryService.searchCategories(q));
    }
}