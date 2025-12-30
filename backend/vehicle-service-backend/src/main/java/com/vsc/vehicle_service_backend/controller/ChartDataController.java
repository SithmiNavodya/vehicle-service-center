package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.service.ChartDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/charts")
@CrossOrigin(origins = "http://localhost:3000")
public class ChartDataController {

    @Autowired
    private ChartDataService chartDataService;

    @GetMapping("/stock-flow/{categoryId}")
    public ResponseEntity<Map<String, Object>> getCategoryStockFlow(
            @PathVariable Long categoryId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Map<String, Object> chartData = chartDataService.getCategoryStockFlow(categoryId, startDate, endDate);
        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/monthly-movement/{categoryId}")
    public ResponseEntity<Map<String, Object>> getMonthlyStockMovement(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "6") int months) {

        Map<String, Object> data = chartDataService.getMonthlyStockMovement(categoryId, months);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/brand-comparison/{categoryId}")
    public ResponseEntity<Map<String, Object>> getBrandComparisonData(@PathVariable Long categoryId) {
        Map<String, Object> data = chartDataService.getBrandComparisonData(categoryId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/stock-status")
    public ResponseEntity<Map<String, Object>> getStockStatusData() {
        Map<String, Object> data = chartDataService.getStockStatusData();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        Map<String, Object> summary = Map.of(
                "totalParts", 150,
                "lowStock", 12,
                "pendingOrders", 5,
                "monthlyUsage", 245,
                "monthlyIncome", 320
        );
        return ResponseEntity.ok(summary);
    }
}