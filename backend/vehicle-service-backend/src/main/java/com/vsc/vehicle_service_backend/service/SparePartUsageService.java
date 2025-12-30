package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.dto.SparePartUsageRequest;
import com.vsc.vehicle_service_backend.dto.SparePartUsageResponse;
import java.util.List;
import java.util.Map;

public interface SparePartUsageService {
    List<SparePartUsageResponse> getAllUsages();
    SparePartUsageResponse getUsageById(Long id);
    List<SparePartUsageResponse> getUsagesByServiceRecord(Long serviceRecordId);
    SparePartUsageResponse createUsage(SparePartUsageRequest request);
    void deleteUsage(Long id);
    Map<String, Object> getUsageChartData(Long categoryId);
    Map<String, Object> getStockFlowData(Long categoryId);
}