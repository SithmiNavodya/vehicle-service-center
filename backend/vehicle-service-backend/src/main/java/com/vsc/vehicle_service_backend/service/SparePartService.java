// src/main/java/com/vsc/vehicle_service_backend/service/SparePartService.java
package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.dto.SparePartRequest;
import com.vsc.vehicle_service_backend.dto.SparePartResponse;
import java.util.List;

public interface SparePartService {
    List<SparePartResponse> getAllSpareParts();
    SparePartResponse getSparePartById(Long id);
    SparePartResponse createSparePart(SparePartRequest request);
    SparePartResponse updateSparePart(Long id, SparePartRequest request);
    void deleteSparePart(Long id);
    List<SparePartResponse> getSparePartsByCategory(Long categoryId); // Add this
    List<SparePartResponse> getSparePartsBySupplier(Long supplierId); // Optional
}