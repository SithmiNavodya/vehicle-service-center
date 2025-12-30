package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.dto.SparePartRequest;
import com.vsc.vehicle_service_backend.dto.SparePartResponse;
import java.util.List;
import java.util.Map;

public interface SparePartService {
    List<SparePartResponse> getAllSpareParts();
    SparePartResponse getPartById(Long id);
    SparePartResponse getPartByCode(String partCode);
    List<SparePartResponse> getPartsByCategory(Long categoryId);
    List<SparePartResponse> getLowStockParts();
    List<SparePartResponse> searchParts(String searchTerm);
    SparePartResponse createSparePart(SparePartRequest request);
    SparePartResponse updateSparePart(Long id, SparePartRequest request);
    void deleteSparePart(Long id);
    boolean existsByPartCode(String partCode);
    Map<String, Object> getStockReport();
}