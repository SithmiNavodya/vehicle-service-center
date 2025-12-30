package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.dto.SupplierRequest;
import com.vsc.vehicle_service_backend.dto.SupplierResponse;
import com.vsc.vehicle_service_backend.entity.Supplier;
import com.vsc.vehicle_service_backend.repository.SupplierRepository;
import com.vsc.vehicle_service_backend.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;  // Add this import
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SupplierResponse getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        return convertToResponse(supplier);
    }

    @Override
    public SupplierResponse getSupplierByCode(String supplierCode) {
        Supplier supplier = supplierRepository.findBySupplierCode(supplierCode)
                .orElseThrow(() -> new RuntimeException("Supplier not found with code: " + supplierCode));
        return convertToResponse(supplier);
    }

    @Override
    @Transactional
    public SupplierResponse createSupplier(SupplierRequest request) {  // Add this missing method
        // Check if supplier code already exists
        if (supplierRepository.existsBySupplierCode(request.getSupplierCode())) {
            throw new RuntimeException("Supplier code already exists: " + request.getSupplierCode());
        }

        Supplier supplier = new Supplier();
        supplier.setSupplierCode(request.getSupplierCode());
        supplier.setSupplierName(request.getSupplierName());
        supplier.setPhone(request.getPhone());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());

        Supplier savedSupplier = supplierRepository.save(supplier);
        return convertToResponse(savedSupplier);
    }

    @Override
    @Transactional
    public SupplierResponse updateSupplier(Long id, SupplierRequest request) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));

        // Check if new supplier code conflicts with existing (excluding current)
        if (!supplier.getSupplierCode().equals(request.getSupplierCode()) &&
                supplierRepository.existsBySupplierCode(request.getSupplierCode())) {
            throw new RuntimeException("Supplier code already exists: " + request.getSupplierCode());
        }

        supplier.setSupplierCode(request.getSupplierCode());
        supplier.setSupplierName(request.getSupplierName());
        supplier.setPhone(request.getPhone());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        supplier.setUpdatedAt(LocalDateTime.now());

        Supplier updatedSupplier = supplierRepository.save(supplier);
        return convertToResponse(updatedSupplier);
    }

    @Override
    @Transactional
    public void deleteSupplier(Long id) {
        try {
            // Check if supplier exists
            if (!supplierRepository.existsById(id)) {
                throw new RuntimeException("Supplier not found with id: " + id);
            }

            supplierRepository.deleteById(id);

        } catch (DataIntegrityViolationException e) {
            // Handle foreign key constraint violation
            throw new RuntimeException("Cannot delete supplier. It is being referenced by other records.");
        } catch (Exception e) {
            throw new RuntimeException("Error deleting supplier: " + e.getMessage());
        }
    }

    @Override
    public List<SupplierResponse> searchSuppliers(String searchTerm) {
        return supplierRepository.findBySupplierNameContainingIgnoreCase(searchTerm).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsBySupplierCode(String supplierCode) {
        return supplierRepository.existsBySupplierCode(supplierCode);
    }

    @Override
    public boolean existsByEmail(String email) {
        return supplierRepository.existsByEmail(email);
    }

    private SupplierResponse convertToResponse(Supplier supplier) {
        SupplierResponse response = new SupplierResponse();
        response.setId(supplier.getId());
        response.setSupplierCode(supplier.getSupplierCode());
        response.setSupplierName(supplier.getSupplierName());
        response.setPhone(supplier.getPhone());
        response.setEmail(supplier.getEmail());
        response.setAddress(supplier.getAddress());
        response.setCreatedAt(supplier.getCreatedAt());
        response.setUpdatedAt(supplier.getUpdatedAt());
        return response;
    }
}