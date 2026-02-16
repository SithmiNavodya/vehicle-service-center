package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.dto.SparePartIncomeRequest;
import com.vsc.vehicle_service_backend.dto.SparePartIncomeResponse;
import com.vsc.vehicle_service_backend.service.SparePartIncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/spare-part-incomes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class SparePartIncomeController {

    @Autowired
    private SparePartIncomeService incomeService;

    @GetMapping
    public ResponseEntity<List<SparePartIncomeResponse>> getAllIncomes() {
        List<SparePartIncomeResponse> incomes = incomeService.getAllIncomes();
        return ResponseEntity.ok(incomes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SparePartIncomeResponse> getIncomeById(@PathVariable Long id) {
        SparePartIncomeResponse income = incomeService.getIncomeById(id);
        return ResponseEntity.ok(income);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<SparePartIncomeResponse>> getPendingIncomes() {
        List<SparePartIncomeResponse> pendingIncomes = incomeService.getPendingIncomes();
        return ResponseEntity.ok(pendingIncomes);
    }

    @PostMapping
    public ResponseEntity<SparePartIncomeResponse> createIncome(@RequestBody SparePartIncomeRequest request) {
        SparePartIncomeResponse createdIncome = incomeService.createIncome(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdIncome);
    }

    @PutMapping("/{id}/receive")
    public ResponseEntity<SparePartIncomeResponse> receiveIncome(@PathVariable Long id) {
        SparePartIncomeResponse receivedIncome = incomeService.receiveIncome(id);
        return ResponseEntity.ok(receivedIncome);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<SparePartIncomeResponse> cancelIncome(@PathVariable Long id) {
        SparePartIncomeResponse cancelledIncome = incomeService.cancelIncome(id);
        return ResponseEntity.ok(cancelledIncome);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/chart-data/{categoryId}")
    public ResponseEntity<Map<String, Object>> getChartData(@PathVariable Long categoryId) {
        Map<String, Object> chartData = incomeService.getChartDataByCategory(categoryId);
        return ResponseEntity.ok(chartData);
    }
}