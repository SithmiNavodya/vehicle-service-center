// src/main/java/com/vsc/vehicle_service_backend/service/impl/SparePartServiceImpl.java
package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.dto.SparePartRequest;
import com.vsc.vehicle_service_backend.dto.SparePartResponse;
import com.vsc.vehicle_service_backend.entity.SparePart;
import com.vsc.vehicle_service_backend.entity.SparePartCategory;
import com.vsc.vehicle_service_backend.entity.Supplier;
import com.vsc.vehicle_service_backend.repository.SparePartCategoryRepository;
import com.vsc.vehicle_service_backend.repository.SparePartRepository;
import com.vsc.vehicle_service_backend.repository.SupplierRepository;
import com.vsc.vehicle_service_backend.service.SparePartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SparePartServiceImpl implements SparePartService {

    private final SparePartRepository sparePartRepository;
    private final SparePartCategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    // Generate part code
    private String generatePartCode() {
        // Find the latest part to increment the number
        SparePart latestPart = sparePartRepository.findTopByOrderByIdDesc().orElse(null);
        int nextNumber = 1;

        if (latestPart != null && latestPart.getPartCode() != null
                && latestPart.getPartCode().startsWith("PART-")) {
            try {
                String numStr = latestPart.getPartCode().substring(5);
                nextNumber = Integer.parseInt(numStr) + 1;
            } catch (NumberFormatException e) {
                // If parsing fails, start from 1
            }
        }

        return String.format("PART-%03d", nextNumber);
    }

    @Override
    public List<SparePartResponse> getAllSpareParts() {
        return sparePartRepository.findAll().stream()
                .map(SparePartResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public SparePartResponse getSparePartById(Long id) {
        SparePart sparePart = sparePartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spare part not found with id: " + id));
        return new SparePartResponse(sparePart);
    }

    @Override
    @Transactional
    public SparePartResponse createSparePart(SparePartRequest request) {
        // Validate category
        SparePartCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        // Validate supplier
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + request.getSupplierId()));

        // Create new spare part
        SparePart sparePart = new SparePart();
        sparePart.setPartCode(generatePartCode());
        sparePart.setPartName(request.getPartName());
        sparePart.setBrand(request.getBrand());
        sparePart.setModel(request.getModel());
        sparePart.setPrice(request.getPrice());
        sparePart.setQuantity(request.getQuantity());
        sparePart.setMinQuantity(request.getMinQuantity());
        sparePart.setImagePath(request.getImagePath());
        sparePart.setCategory(category);
        sparePart.setSupplier(supplier);

        SparePart savedPart = sparePartRepository.save(sparePart);
        return new SparePartResponse(savedPart);
    }

    @Override
    @Transactional
    public SparePartResponse updateSparePart(Long id, SparePartRequest request) {
        // Find existing spare part
        SparePart sparePart = sparePartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spare part not found with id: " + id));

        // Validate category
        SparePartCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        // Validate supplier
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + request.getSupplierId()));

        // Update fields
        sparePart.setPartName(request.getPartName());
        sparePart.setBrand(request.getBrand());
        sparePart.setModel(request.getModel());
        sparePart.setPrice(request.getPrice());
        sparePart.setQuantity(request.getQuantity());
        sparePart.setMinQuantity(request.getMinQuantity());
        sparePart.setImagePath(request.getImagePath());
        sparePart.setCategory(category);
        sparePart.setSupplier(supplier);

        SparePart updatedPart = sparePartRepository.save(sparePart);
        return new SparePartResponse(updatedPart);
    }

    @Override
    @Transactional
    public void deleteSparePart(Long id) {
        if (!sparePartRepository.existsById(id)) {
            throw new RuntimeException("Spare part not found with id: " + id);
        }
        sparePartRepository.deleteById(id);
    }

    @Override
    public List<SparePartResponse> getSparePartsByCategory(Long categoryId) {
        // Find category first
        SparePartCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

        return sparePartRepository.findByCategory(category).stream()
                .map(SparePartResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<SparePartResponse> getSparePartsBySupplier(Long supplierId) {
        // Find supplier first
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + supplierId));

        return sparePartRepository.findBySupplier(supplier).stream()
                .map(SparePartResponse::new)
                .collect(Collectors.toList());
    }
}