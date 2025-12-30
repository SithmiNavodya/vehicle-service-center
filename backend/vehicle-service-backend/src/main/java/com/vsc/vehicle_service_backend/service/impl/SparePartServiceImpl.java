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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SparePartServiceImpl implements SparePartService {

    @Autowired
    private SparePartRepository sparePartRepository;

    @Autowired
    private SparePartCategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public List<SparePartResponse> getAllSpareParts() {
        return sparePartRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SparePartResponse getPartById(Long id) {
        SparePart part = sparePartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spare part not found with id: " + id));
        return convertToResponse(part);
    }

    @Override
    public SparePartResponse getPartByCode(String partCode) {
        SparePart part = sparePartRepository.findByPartCode(partCode)
                .orElseThrow(() -> new RuntimeException("Spare part not found with code: " + partCode));
        return convertToResponse(part);
    }

    @Override
    public List<SparePartResponse> getPartsByCategory(Long categoryId) {
        return sparePartRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SparePartResponse> getLowStockParts() {
        return sparePartRepository.findLowStockParts().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SparePartResponse> searchParts(String searchTerm) {
        return sparePartRepository.searchParts(searchTerm).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SparePartResponse createSparePart(SparePartRequest request) {
        // Check if part code already exists
        if (sparePartRepository.existsByPartCode(request.getPartCode())) {
            throw new RuntimeException("Part code already exists: " + request.getPartCode());
        }

        SparePartCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + request.getSupplierId()));

        SparePart part = new SparePart();
        part.setPartCode(request.getPartCode());
        part.setPartName(request.getPartName());
        part.setBrand(request.getBrand());
        part.setModel(request.getModel());

        // FIXED: Directly set Double price, no BigDecimal conversion needed
        part.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);

        part.setQuantity(request.getQuantity() != null ? request.getQuantity() : 0);
        part.setMinQuantity(request.getMinQuantity() != null ? request.getMinQuantity() : 10);
        part.setImagePath(request.getImagePath());
        part.setCategory(category);
        part.setSupplier(supplier);

        SparePart savedPart = sparePartRepository.save(part);
        return convertToResponse(savedPart);
    }

    @Override
    @Transactional
    public SparePartResponse updateSparePart(Long id, SparePartRequest request) {
        SparePart part = sparePartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spare part not found with id: " + id));

        // Check if new part code conflicts with existing (excluding current)
        if (!part.getPartCode().equals(request.getPartCode()) &&
                sparePartRepository.existsByPartCode(request.getPartCode())) {
            throw new RuntimeException("Part code already exists: " + request.getPartCode());
        }

        SparePartCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + request.getSupplierId()));

        part.setPartCode(request.getPartCode());
        part.setPartName(request.getPartName());
        part.setBrand(request.getBrand());
        part.setModel(request.getModel());

        // FIXED: Directly set Double price if provided
        if (request.getPrice() != null) {
            part.setPrice(request.getPrice());
        }
        // If price is null, keep existing price

        part.setQuantity(request.getQuantity() != null ? request.getQuantity() : part.getQuantity());
        part.setMinQuantity(request.getMinQuantity() != null ? request.getMinQuantity() : part.getMinQuantity());
        part.setImagePath(request.getImagePath());
        part.setCategory(category);
        part.setSupplier(supplier);
        part.setUpdatedAt(java.time.LocalDateTime.now());

        SparePart updatedPart = sparePartRepository.save(part);
        return convertToResponse(updatedPart);
    }

    @Override
    @Transactional
    public void deleteSparePart(Long id) {
        SparePart part = sparePartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spare part not found with id: " + id));
        sparePartRepository.delete(part);
    }

    @Override
    public boolean existsByPartCode(String partCode) {
        return sparePartRepository.existsByPartCode(partCode);
    }

    @Override
    public Map<String, Object> getStockReport() {
        Map<String, Object> report = new HashMap<>();

        List<SparePart> allParts = sparePartRepository.findAll();
        long totalParts = allParts.size();

        long lowStockCount = allParts.stream()
                .filter(p -> p.getQuantity() <= p.getMinQuantity())
                .count();

        long mediumStockCount = allParts.stream()
                .filter(p -> p.getQuantity() > p.getMinQuantity() && p.getQuantity() <= p.getMinQuantity() * 2)
                .count();

        long highStockCount = totalParts - lowStockCount - mediumStockCount;

        // Calculate total value
        double totalValue = allParts.stream()
                .mapToDouble(p -> p.getPrice() * p.getQuantity())  // FIXED: Use p.getPrice() directly
                .sum();

        report.put("totalParts", totalParts);
        report.put("lowStockCount", lowStockCount);
        report.put("mediumStockCount", mediumStockCount);
        report.put("highStockCount", highStockCount);
        report.put("totalValue", totalValue);
        report.put("lowStockPercentage", totalParts > 0 ? (lowStockCount * 100.0 / totalParts) : 0);

        return report;
    }

    private SparePartResponse convertToResponse(SparePart part) {
        SparePartResponse response = new SparePartResponse();
        response.setId(part.getId());
        response.setPartCode(part.getPartCode());
        response.setPartName(part.getPartName());
        response.setBrand(part.getBrand());
        response.setModel(part.getModel());
        response.setPrice(part.getPrice() != null ? part.getPrice() : 0.0);  // FIXED: Use getPrice() directly
        response.setQuantity(part.getQuantity());
        response.setMinQuantity(part.getMinQuantity());
        response.setImagePath(part.getImagePath());

        // Calculate stock status
        String stockStatus = calculateStockStatus(part.getQuantity(), part.getMinQuantity());
        response.setStockStatus(stockStatus);

        if (part.getCategory() != null) {
            response.setCategoryId(part.getCategory().getId());
            response.setCategoryName(part.getCategory().getCategoryName());
        }

        if (part.getSupplier() != null) {
            response.setSupplierId(part.getSupplier().getId());
            response.setSupplierName(part.getSupplier().getSupplierName());
        }

        response.setCreatedAt(part.getCreatedAt());
        response.setUpdatedAt(part.getUpdatedAt());
        return response;
    }

    private String calculateStockStatus(Integer quantity, Integer minQuantity) {
        if (quantity <= minQuantity) {
            return "LOW";
        } else if (quantity <= (minQuantity * 2)) {
            return "MEDIUM";
        } else {
            return "HIGH";
        }
    }
}