// src/main/java/com/vsc/vehicle_service_backend/service/impl/SparePartUsageServiceImpl.java
package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.dto.SparePartUsageRequest;
import com.vsc.vehicle_service_backend.dto.SparePartUsageResponse;
import com.vsc.vehicle_service_backend.entity.*;
import com.vsc.vehicle_service_backend.repository.*;
import com.vsc.vehicle_service_backend.service.SparePartUsageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SparePartUsageServiceImpl implements SparePartUsageService {

    private final SparePartUsageRepository sparePartUsageRepository;
    private final SparePartRepository sparePartRepository;
    private final ServiceRecordRepository serviceRecordRepository;
    private final VehicleRepository vehicleRepository;
    private final SparePartCategoryRepository categoryRepository;

    // 1. Get all usages
    @Override
    public List<SparePartUsageResponse> getAllUsages() {
        return sparePartUsageRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // 2. Get usage by ID
    @Override
    public SparePartUsageResponse getUsageById(Long id) {
        SparePartUsage usage = sparePartUsageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usage record not found with id: " + id));
        return convertToResponse(usage);
    }

    // 3. Create usage (same as recordUsage)
    @Override
    public SparePartUsageResponse createUsage(SparePartUsageRequest request) {
        return recordUsage(request); // Call existing recordUsage method
    }

    // 4. Delete usage
    @Override
    @Transactional
    public void deleteUsage(Long id) {
        SparePartUsage usage = sparePartUsageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usage record not found with id: " + id));

        // Return stock to inventory
        for (SparePartUsageItem item : usage.getItems()) {
            SparePart sparePart = item.getSparePart();
            sparePart.setQuantity(sparePart.getQuantity() + item.getQuantityUsed());
            sparePartRepository.save(sparePart);
        }

        sparePartUsageRepository.delete(usage);
    }

    // 5. Get usage chart data
    @Override
    public Map<String, Object> getUsageChartData(Long categoryId) {
        Map<String, Object> result = new HashMap<>();

        // Get category
        SparePartCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Get all parts in this category
        List<SparePart> categoryParts = sparePartRepository.findByCategory(category);

        // Get usage data for last 6 months
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(6);

        List<SparePartUsage> usages = sparePartUsageRepository.findByUsageDateBetween(startDate, endDate);

        // Filter usages for this category
        List<SparePartUsage> categoryUsages = usages.stream()
                .filter(usage -> usage.getItems().stream()
                        .anyMatch(item -> categoryParts.contains(item.getSparePart())))
                .collect(Collectors.toList());

        // Prepare chart data
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        Map<String, Double> monthlyTotals = new HashMap<>();

        for (SparePartUsage usage : categoryUsages) {
            String month = usage.getUsageDate().getMonth().toString();
            double total = usage.getTotalCost() != null ? usage.getTotalCost().doubleValue() : 0.0;
            monthlyTotals.merge(month, total, Double::sum);
        }

        for (Map.Entry<String, Double> entry : monthlyTotals.entrySet()) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", entry.getKey());
            monthData.put("totalCost", entry.getValue());
            monthData.put("usageCount", categoryUsages.stream()
                    .filter(u -> u.getUsageDate().getMonth().toString().equals(entry.getKey()))
                    .count());
            monthlyData.add(monthData);
        }

        result.put("monthlyData", monthlyData);
        result.put("categoryName", category.getCategoryName());
        result.put("totalUsages", categoryUsages.size());
        result.put("totalCost", categoryUsages.stream()
                .mapToDouble(u -> u.getTotalCost() != null ? u.getTotalCost().doubleValue() : 0.0)
                .sum());

        return result;
    }

    // 6. Get stock flow data
    @Override
    public Map<String, Object> getStockFlowData(Long categoryId) {
        Map<String, Object> result = new HashMap<>();

        // Get category
        SparePartCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Get all parts in this category
        List<SparePart> categoryParts = sparePartRepository.findByCategory(category);

        // Get usage data for last 3 months
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(3);

        List<SparePartUsage> usages = sparePartUsageRepository.findByUsageDateBetween(startDate, endDate);

        // Filter usages for this category
        List<SparePartUsage> categoryUsages = usages.stream()
                .filter(usage -> usage.getItems().stream()
                        .anyMatch(item -> categoryParts.contains(item.getSparePart())))
                .collect(Collectors.toList());

        // Prepare stock flow data
        List<Map<String, Object>> flowData = new ArrayList<>();

        for (SparePart part : categoryParts) {
            int totalUsed = categoryUsages.stream()
                    .flatMap(usage -> usage.getItems().stream())
                    .filter(item -> item.getSparePart().getId().equals(part.getId()))
                    .mapToInt(SparePartUsageItem::getQuantityUsed)
                    .sum();

            if (totalUsed > 0) {
                Map<String, Object> partData = new HashMap<>();
                partData.put("partCode", part.getPartCode());
                partData.put("partName", part.getPartName());
                partData.put("currentStock", part.getQuantity());
                partData.put("totalUsed", totalUsed);
                partData.put("usageRate", (double) totalUsed / 3); // per month
                flowData.add(partData);
            }
        }

        result.put("flowData", flowData);
        result.put("categoryName", category.getCategoryName());
        result.put("totalParts", categoryParts.size());
        result.put("activeParts", flowData.size());

        return result;
    }

    // 7. Existing recordUsage method (keep this)
    @Override
    @Transactional
    public SparePartUsageResponse recordUsage(SparePartUsageRequest request) {
        // Validate spare part exists
        SparePart sparePart = sparePartRepository.findById(request.getSparePartId())
                .orElseThrow(() -> new RuntimeException("Spare part not found with id: " + request.getSparePartId()));

        // Validate service record exists if provided
        ServiceRecord serviceRecord = null;
        if (request.getServiceRecordId() != null) {
            serviceRecord = serviceRecordRepository.findById(request.getServiceRecordId())
                    .orElseThrow(() -> new RuntimeException("Service record not found with id: " + request.getServiceRecordId()));
        }

        // Validate vehicle exists if provided
        Vehicle vehicle = null;
        if (request.getVehicleId() != null) {
            vehicle = vehicleRepository.findById(request.getVehicleId())
                    .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + request.getVehicleId()));
        }

        // Check if enough stock is available
        if (sparePart.getQuantity() < request.getQuantityUsed()) {
            throw new RuntimeException("Insufficient stock. Available: " + sparePart.getQuantity() +
                    ", Requested: " + request.getQuantityUsed());
        }

        // Create usage record
        SparePartUsage usage = new SparePartUsage();
        usage.setUsageNumber(generateUsageNumber());
        usage.setUsageDate(LocalDate.now());
        usage.setServiceRecord(serviceRecord);
        usage.setVehicle(vehicle);
        usage.setTechnicianName(request.getTechnicianName());
        usage.setNotes(request.getNotes());

        // Create usage item
        SparePartUsageItem item = new SparePartUsageItem();
        item.setSparePart(sparePart);
        item.setQuantityUsed(request.getQuantityUsed());
        item.setUnitCost(BigDecimal.valueOf(request.getUnitPrice()));
        item.setTotalCost(item.calculateTotalCost());

        usage.addItem(item);
        usage.setTotalCost(usage.calculateTotalCost());

        // Update spare part stock
        sparePart.setQuantity(sparePart.getQuantity() - request.getQuantityUsed());
        sparePartRepository.save(sparePart);

        SparePartUsage savedUsage = sparePartUsageRepository.save(usage);
        return convertToResponse(savedUsage);
    }

    // 8. Get usage by spare part
    @Override
    public List<SparePartUsageResponse> getUsageBySparePart(Long sparePartId) {
        SparePart sparePart = sparePartRepository.findById(sparePartId)
                .orElseThrow(() -> new RuntimeException("Spare part not found with id: " + sparePartId));

        List<SparePartUsage> usages = sparePartUsageRepository.findByItems_SparePart(sparePart);

        return usages.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // 9. Get usage by service record
    @Override
    public List<SparePartUsageResponse> getUsageByServiceJob(Long serviceRecordId) {
        ServiceRecord serviceRecord = serviceRecordRepository.findById(serviceRecordId)
                .orElseThrow(() -> new RuntimeException("Service record not found with id: " + serviceRecordId));

        List<SparePartUsage> usages = sparePartUsageRepository.findByServiceRecord(serviceRecord);

        return usages.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // 10. Get usage by date range
    @Override
    public List<SparePartUsageResponse> getUsageByDateRange(LocalDate startDate, LocalDate endDate) {
        return sparePartUsageRepository.findByUsageDateBetween(startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private String generateUsageNumber() {
        // Generate a usage number like USG-20250102-001
        LocalDate today = LocalDate.now();
        String dateStr = today.toString().replace("-", "");

        Long count = sparePartUsageRepository.count();
        String sequence = String.format("%03d", count + 1);

        return "USG-" + dateStr + "-" + sequence;
    }

    private SparePartUsageResponse convertToResponse(SparePartUsage usage) {
        SparePartUsageResponse response = new SparePartUsageResponse();
        response.setId(usage.getId());
        response.setUsageNumber(usage.getUsageNumber());
        response.setUsageDate(usage.getUsageDate());
        response.setTechnicianName(usage.getTechnicianName());
        response.setNotes(usage.getNotes());
        response.setTotalCost(usage.getTotalCost() != null ? usage.getTotalCost().doubleValue() : 0.0);
        response.setCreatedAt(usage.getCreatedAt());

        if (usage.getServiceRecord() != null) {
            response.setServiceRecordId(usage.getServiceRecord().getId());
        }

        if (usage.getVehicle() != null) {
            response.setVehicleId(usage.getVehicle().getId());
            response.setVehicleInfo(usage.getVehicleInfo());
        }

        // Add items information
        if (!usage.getItems().isEmpty()) {
            SparePartUsageItem firstItem = usage.getItems().get(0);
            response.setSparePartId(firstItem.getSparePart().getId());
            response.setSparePartCode(firstItem.getSparePart().getPartCode());
            response.setSparePartName(firstItem.getSparePart().getPartName());
            response.setQuantityUsed(firstItem.getQuantityUsed());
            response.setUnitPrice(firstItem.getUnitCost() != null ? firstItem.getUnitCost().doubleValue() : 0.0);
        }

        return response;
    }
}