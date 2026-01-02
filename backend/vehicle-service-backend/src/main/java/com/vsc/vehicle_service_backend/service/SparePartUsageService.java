// src/main/java/com/vsc/vehicle_service_backend/service/SparePartUsageService.java
package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.dto.SparePartUsageRequest;
import com.vsc.vehicle_service_backend.dto.SparePartUsageResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface SparePartUsageService {
    // Add these methods that your controller is calling
    List<SparePartUsageResponse> getAllUsages();
    SparePartUsageResponse getUsageById(Long id);
    SparePartUsageResponse createUsage(SparePartUsageRequest request);
    void deleteUsage(Long id);
    Map<String, Object> getUsageChartData(Long categoryId);
    Map<String, Object> getStockFlowData(Long categoryId);

    // Existing methods (keep these)
    SparePartUsageResponse recordUsage(SparePartUsageRequest request);
    List<SparePartUsageResponse> getUsageBySparePart(Long sparePartId);
    List<SparePartUsageResponse> getUsageByServiceJob(Long serviceRecordId);
    List<SparePartUsageResponse> getUsageByDateRange(LocalDate startDate, LocalDate endDate);
}