package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.dto.SparePartIncomeRequest;
import com.vsc.vehicle_service_backend.dto.SparePartIncomeResponse;
import com.vsc.vehicle_service_backend.service.SparePartIncomeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spare-part-incomes")
@CrossOrigin(origins = "http://localhost:3000")
public class SparePartIncomeController {

    @Autowired
    private SparePartIncomeService incomeService;

    @GetMapping
    public ResponseEntity<List<SparePartIncomeResponse>> getAllIncomes() {
        return ResponseEntity.ok(incomeService.getAllIncomes());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<SparePartIncomeResponse>> getPendingIncomes() {
        return ResponseEntity.ok(incomeService.getPendingIncomes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SparePartIncomeResponse> getIncomeById(@PathVariable Long id) {
        return ResponseEntity.ok(incomeService.getIncomeById(id));
    }

    @PostMapping
    public ResponseEntity<SparePartIncomeResponse> createIncome(@Valid @RequestBody SparePartIncomeRequest request) {
        return ResponseEntity.ok(incomeService.createIncome(request));
    }

    @PutMapping("/{id}/receive")
    public ResponseEntity<SparePartIncomeResponse> receiveIncome(@PathVariable Long id) {
        return ResponseEntity.ok(incomeService.receiveIncome(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<SparePartIncomeResponse> cancelIncome(@PathVariable Long id) {
        return ResponseEntity.ok(incomeService.cancelIncome(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/chart-data/{categoryId}")
    public ResponseEntity<?> getChartDataByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(incomeService.getChartDataByCategory(categoryId));
    }
}