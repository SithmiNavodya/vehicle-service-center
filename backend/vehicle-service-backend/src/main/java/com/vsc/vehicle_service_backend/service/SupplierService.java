package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.dto.SupplierRequest;
import com.vsc.vehicle_service_backend.dto.SupplierResponse;
import java.util.List;

public interface SupplierService {
    List<SupplierResponse> getAllSuppliers();
    SupplierResponse getSupplierById(Long id);
    SupplierResponse getSupplierByCode(String supplierCode);
    SupplierResponse createSupplier(SupplierRequest request);
    SupplierResponse updateSupplier(Long id, SupplierRequest request);
    void deleteSupplier(Long id);
    List<SupplierResponse> searchSuppliers(String searchTerm);
    boolean existsBySupplierCode(String supplierCode);
    boolean existsByEmail(String email);
}