package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.dto.SparePartUsageRequest;
import com.vsc.vehicle_service_backend.dto.SparePartUsageResponse;
import com.vsc.vehicle_service_backend.entity.*;
import com.vsc.vehicle_service_backend.repository.*;
import com.vsc.vehicle_service_backend.service.SparePartUsageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SparePartUsageServiceImpl implements SparePartUsageService {

    @Autowired
    private SparePartUsageRepository usageRepository;

    @Autowired
    private SparePartRepository sparePartRepository;

    @Autowired
    private ServiceRecordRepository serviceRecordRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    public List<SparePartUsageResponse> getAllUsages() {
        return usageRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SparePartUsageResponse getUsageById(Long id) {
        SparePartUsage usage = usageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usage record not found with id: " + id));
        return convertToResponse(usage);
    }

    @Override
    public List<SparePartUsageResponse> getUsagesByServiceRecord(Long serviceRecordId) {
        return usageRepository.findByServiceRecordId(serviceRecordId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SparePartUsageResponse createUsage(SparePartUsageRequest request) {
        // Generate usage number
        String usageNumber = "USG-" + System.currentTimeMillis();

        // Create usage record
        SparePartUsage usage = new SparePartUsage();
        usage.setUsageNumber(usageNumber);
        usage.setUsageDate(request.getUsageDate() != null ? request.getUsageDate() : LocalDate.now());
        usage.setTechnicianName(request.getTechnicianName());
        usage.setNotes(request.getNotes());

        // Set service record if provided
        if (request.getServiceRecordId() != null) {
            ServiceRecord serviceRecord = serviceRecordRepository.findById(request.getServiceRecordId())
                    .orElseThrow(() -> new RuntimeException("Service record not found with id: " + request.getServiceRecordId()));
            usage.setServiceRecord(serviceRecord);
        }

        // Set vehicle if provided
        if (request.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                    .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + request.getVehicleId()));
            usage.setVehicle(vehicle);
        }

        // Process items and update stock
        BigDecimal totalCost = BigDecimal.ZERO;
        List<SparePartUsageItem> items = new ArrayList<>();

        for (SparePartUsageRequest.Item itemRequest : request.getItems()) {
            SparePart sparePart = sparePartRepository.findById(itemRequest.getSparePartId())
                    .orElseThrow(() -> new RuntimeException("Spare part not found with id: " + itemRequest.getSparePartId()));

            // Check if sufficient stock is available
            if (sparePart.getQuantity() < itemRequest.getQuantityUsed()) {
                throw new RuntimeException("Insufficient stock for part: " + sparePart.getPartCode() +
                        ". Available: " + sparePart.getQuantity() + ", Requested: " + itemRequest.getQuantityUsed());
            }

            SparePartUsageItem item = new SparePartUsageItem();
            item.setSparePart(sparePart);
            item.setQuantityUsed(itemRequest.getQuantityUsed());
            item.setUnitCost(BigDecimal.valueOf(itemRequest.getUnitCost()));
            item.setTotalCost(BigDecimal.valueOf(itemRequest.getTotalCost()));
            item.setUsage(usage);

            items.add(item);
            totalCost = totalCost.add(item.getTotalCost());

            // Update stock quantity
            sparePart.setQuantity(sparePart.getQuantity() - itemRequest.getQuantityUsed());
            sparePart.setUpdatedAt(LocalDateTime.now());
            sparePartRepository.save(sparePart);
        }

        usage.setItems(items);
        usage.setTotalCost(totalCost);
        usage.setCreatedAt(LocalDateTime.now());

        SparePartUsage savedUsage = usageRepository.save(usage);
        return convertToResponse(savedUsage);
    }

    @Override
    @Transactional
    public void deleteUsage(Long id) {
        SparePartUsage usage = usageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usage record not found with id: " + id));

        // Restore stock quantities
        for (SparePartUsageItem item : usage.getItems()) {
            SparePart sparePart = item.getSparePart();
            sparePart.setQuantity(sparePart.getQuantity() + item.getQuantityUsed());
            sparePart.setUpdatedAt(LocalDateTime.now());
            sparePartRepository.save(sparePart);
        }

        usageRepository.delete(usage);
    }

    @Override
    public Map<String, Object> getUsageChartData(Long categoryId) {
        Map<String, Object> chartData = new HashMap<>();

        // Get last 6 months data
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(6);

        // Get monthly usage data
        List<Object[]> monthlyUsage = usageRepository.findMonthlyUsageByCategory(categoryId, startDate, endDate);

        // Process data for chart
        List<String> labels = monthlyUsage.stream()
                .map(row -> formatMonth((String) row[0]))
                .collect(Collectors.toList());

        List<Double> usageData = monthlyUsage.stream()
                .map(row -> ((Number) row[1]).doubleValue())
                .collect(Collectors.toList());

        chartData.put("labels", labels);
        chartData.put("usageData", usageData);
        chartData.put("totalUsage", usageData.stream().mapToDouble(Double::doubleValue).sum());

        return chartData;
    }

    @Override
    public Map<String, Object> getStockFlowData(Long categoryId) {
        Map<String, Object> stockFlow = new HashMap<>();

        // Get last 3 months data for detailed view
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(3);

        // Get usage by brand
        List<Object[]> usageByBrand = usageRepository.findUsageByBrandAndCategory(categoryId, startDate, endDate);

        Map<String, Double> brandUsageMap = new HashMap<>();
        for (Object[] row : usageByBrand) {
            String brand = (String) row[0];
            Double quantity = ((Number) row[1]).doubleValue();
            brandUsageMap.put(brand, brandUsageMap.getOrDefault(brand, 0.0) + quantity);
        }

        // Get current stock by brand
        List<SparePart> parts = sparePartRepository.findByCategoryId(categoryId);
        Map<String, Integer> brandStockMap = new HashMap<>();
        for (SparePart part : parts) {
            String brand = part.getBrand() != null ? part.getBrand() : "Unknown";
            brandStockMap.put(brand, brandStockMap.getOrDefault(brand, 0) + part.getQuantity());
        }

        stockFlow.put("usageByBrand", brandUsageMap);
        stockFlow.put("stockByBrand", brandStockMap);

        // Get low stock parts
        List<Map<String, Object>> lowStockPartsList = parts.stream()
                .filter(p -> p.getQuantity() <= p.getMinQuantity())
                .map(p -> {
                    Map<String, Object> partMap = new HashMap<>();
                    partMap.put("partCode", p.getPartCode());
                    partMap.put("partName", p.getPartName());
                    partMap.put("brand", p.getBrand());
                    partMap.put("currentStock", p.getQuantity());
                    partMap.put("minQuantity", p.getMinQuantity());
                    return partMap;
                })
                .collect(Collectors.toList());

        stockFlow.put("lowStockParts", lowStockPartsList);

        return stockFlow;
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

        // Set service record ID if exists
        if (usage.getServiceRecord() != null) {
            response.setServiceRecordId(usage.getServiceRecord().getId());
        }

        // Set vehicle ID if exists
        if (usage.getVehicle() != null) {
            response.setVehicleId(usage.getVehicle().getId());
            response.setVehicleNumber(usage.getVehicle().getVehicleNumber());
        }

        // Convert items
        List<SparePartUsageResponse.Item> items = usage.getItems().stream()
                .map(item -> {
                    SparePartUsageResponse.Item itemResponse = new SparePartUsageResponse.Item();
                    itemResponse.setId(item.getId());
                    itemResponse.setSparePartId(item.getSparePart().getId());
                    itemResponse.setPartCode(item.getSparePart().getPartCode());
                    itemResponse.setPartName(item.getSparePart().getPartName());
                    itemResponse.setQuantityUsed(item.getQuantityUsed());
                    itemResponse.setUnitCost(item.getUnitCost() != null ? item.getUnitCost().doubleValue() : 0.0);
                    itemResponse.setTotalCost(item.getTotalCost() != null ? item.getTotalCost().doubleValue() : 0.0);
                    return itemResponse;
                })
                .collect(Collectors.toList());

        response.setItems(items);
        return response;
    }

    private String formatMonth(String monthKey) {
        // monthKey format: "2024-01"
        String[] parts = monthKey.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);

        String[] monthNames = {"Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        return monthNames[month - 1] + " " + year;
    }
}