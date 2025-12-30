package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.dto.SparePartResponse;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface ChartDataService {
    Map<String, Object> getCategoryStockFlow(Long categoryId, LocalDate startDate, LocalDate endDate);
    Map<String, Object> getMonthlyStockMovement(Long categoryId, int months);
    Map<String, Object> getBrandComparisonData(Long categoryId);
    Map<String, Object> getStockStatusData();
    List<SparePartResponse> getLowStockParts(); // Add this method
}