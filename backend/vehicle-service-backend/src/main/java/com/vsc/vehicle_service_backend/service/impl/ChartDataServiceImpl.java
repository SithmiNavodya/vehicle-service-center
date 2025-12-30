package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.dto.SparePartResponse;
import com.vsc.vehicle_service_backend.entity.SparePart;
import com.vsc.vehicle_service_backend.repository.SparePartIncomeRepository;
import com.vsc.vehicle_service_backend.repository.SparePartRepository;
import com.vsc.vehicle_service_backend.repository.SparePartUsageRepository;
import com.vsc.vehicle_service_backend.service.ChartDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChartDataServiceImpl implements ChartDataService {

    @Autowired
    private SparePartIncomeRepository incomeRepository;

    @Autowired
    private SparePartUsageRepository usageRepository;

    @Autowired
    private SparePartRepository sparePartRepository;

    @Override
    public Map<String, Object> getCategoryStockFlow(Long categoryId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> chartData = new HashMap<>();

        // Get income data by brand
        List<Object[]> incomeByBrand = incomeRepository.findIncomeByBrandAndCategory(
                categoryId, startDate, endDate);

        // Get usage data by brand
        List<Object[]> usageByBrand = usageRepository.findUsageByBrandAndCategory(
                categoryId, startDate, endDate);

        // Prepare datasets
        Map<String, Double> brandIncomeMap = new HashMap<>();
        Map<String, Double> brandUsageMap = new HashMap<>();
        Set<String> brands = new HashSet<>();

        // Process income data
        for (Object[] row : incomeByBrand) {
            String brand = (String) row[0];
            Double quantity = ((Number) row[1]).doubleValue();
            brands.add(brand);
            brandIncomeMap.put(brand, brandIncomeMap.getOrDefault(brand, 0.0) + quantity);
        }

        // Process usage data
        for (Object[] row : usageByBrand) {
            String brand = (String) row[0];
            Double quantity = ((Number) row[1]).doubleValue();
            brands.add(brand);
            brandUsageMap.put(brand, brandUsageMap.getOrDefault(brand, 0.0) + quantity);
        }

        // Prepare chart structure
        List<String> brandList = new ArrayList<>(brands);
        Collections.sort(brandList);

        List<Double> incomeData = new ArrayList<>();
        List<Double> usageData = new ArrayList<>();
        List<String> brandColors = new ArrayList<>();

        for (String brand : brandList) {
            incomeData.add(brandIncomeMap.getOrDefault(brand, 0.0));
            usageData.add(brandUsageMap.getOrDefault(brand, 0.0));
            brandColors.add(getBrandColor(brand));
        }

        chartData.put("labels", brandList);
        chartData.put("incomeData", incomeData);
        chartData.put("usageData", usageData);
        chartData.put("colors", brandColors);

        return chartData;
    }

    @Override
    public Map<String, Object> getMonthlyStockMovement(Long categoryId, int months) {
        Map<String, Object> result = new HashMap<>();

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(months);

        // Get monthly income
        List<Object[]> monthlyIncome = incomeRepository.findMonthlyIncomeByCategory(
                categoryId, startDate, endDate);

        // Get monthly usage
        List<Object[]> monthlyUsage = usageRepository.findMonthlyUsageByCategory(
                categoryId, startDate, endDate);

        // Create month labels
        List<String> monthsList = new ArrayList<>();
        Map<String, Double> incomeMap = new HashMap<>();
        Map<String, Double> usageMap = new HashMap<>();

        // Initialize all months
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthDate = endDate.minusMonths(i);
            String monthLabel = monthDate.getMonth().toString().substring(0, 3) + " " + monthDate.getYear();
            monthsList.add(monthLabel);
            incomeMap.put(monthLabel, 0.0);
            usageMap.put(monthLabel, 0.0);
        }

        // Fill income data
        for (Object[] row : monthlyIncome) {
            String monthKey = (String) row[0];
            String monthLabel = formatMonthKey(monthKey);
            Double quantity = ((Number) row[1]).doubleValue();
            if (incomeMap.containsKey(monthLabel)) {
                incomeMap.put(monthLabel, quantity);
            }
        }

        // Fill usage data
        for (Object[] row : monthlyUsage) {
            String monthKey = (String) row[0];
            String monthLabel = formatMonthKey(monthKey);
            Double quantity = ((Number) row[1]).doubleValue();
            if (usageMap.containsKey(monthLabel)) {
                usageMap.put(monthLabel, quantity);
            }
        }

        // Prepare data lists in correct order
        List<Double> incomeData = monthsList.stream()
                .map(incomeMap::get)
                .collect(Collectors.toList());

        List<Double> usageData = monthsList.stream()
                .map(usageMap::get)
                .collect(Collectors.toList());

        result.put("labels", monthsList);
        result.put("income", incomeData);
        result.put("usage", usageData);
        result.put("netStock", calculateNetStock(incomeData, usageData));

        return result;
    }

    @Override
    public Map<String, Object> getBrandComparisonData(Long categoryId) {
        Map<String, Object> result = new HashMap<>();

        // Get current month data
        LocalDate startDate = LocalDate.now().withDayOfMonth(1);
        LocalDate endDate = LocalDate.now();

        Map<String, Object> brandData = getCategoryStockFlow(categoryId, startDate, endDate);

        // Get stock levels by brand
        List<SparePart> parts = sparePartRepository.findByCategoryId(categoryId);
        Map<String, Integer> stockByBrand = new HashMap<>();

        for (SparePart part : parts) {
            String brand = part.getBrand() != null ? part.getBrand() : "Unknown";
            stockByBrand.put(brand, stockByBrand.getOrDefault(brand, 0) + part.getQuantity());
        }

        List<String> brands = new ArrayList<>(stockByBrand.keySet());
        List<Integer> stockLevels = brands.stream()
                .map(stockByBrand::get)
                .collect(Collectors.toList());

        result.put("brands", brands);
        result.put("stockLevels", stockLevels);
        result.put("incomeVsUsage", brandData);

        return result;
    }

    @Override
    public Map<String, Object> getStockStatusData() {
        Map<String, Object> result = new HashMap<>();

        List<SparePart> lowStockParts = sparePartRepository.findLowStockParts();
        List<Object[]> lowStockData = lowStockParts.stream()
                .map(p -> new Object[]{
                        p.getPartCode(),
                        p.getPartName(),
                        p.getBrand(),
                        p.getQuantity(),
                        p.getMinQuantity(),
                        p.getCategory().getCategoryName()
                })
                .collect(Collectors.toList());

        // Count by status
        long lowStockCount = lowStockParts.size();
        long totalParts = sparePartRepository.count();
        long mediumStockCount = calculateMediumStockCount();

        result.put("lowStockParts", lowStockData);
        result.put("lowStockCount", lowStockCount);
        result.put("totalParts", totalParts);
        result.put("stockStatus", Map.of(
                "low", lowStockCount,
                "medium", mediumStockCount,
                "high", totalParts - lowStockCount - mediumStockCount
        ));

        return result;
    }

    @Override
    public List<SparePartResponse> getLowStockParts() {
        List<SparePart> lowStockParts = sparePartRepository.findLowStockParts();
        return lowStockParts.stream()
                .map(this::mapToSparePartResponse)
                .collect(Collectors.toList());
    }

    private SparePartResponse mapToSparePartResponse(SparePart sparePart) {
        SparePartResponse response = new SparePartResponse();
        response.setId(sparePart.getId());
        response.setPartCode(sparePart.getPartCode());
        response.setPartName(sparePart.getPartName());
        response.setBrand(sparePart.getBrand());
        response.setModel(sparePart.getModel());
        response.setPrice(sparePart.getPrice() != null ? sparePart.getPrice().doubleValue() : 0.0);
        response.setQuantity(sparePart.getQuantity());
        response.setMinQuantity(sparePart.getMinQuantity());
        response.setImagePath(sparePart.getImagePath());

        // Calculate stock status
        String stockStatus = calculateStockStatus(sparePart.getQuantity(), sparePart.getMinQuantity());
        response.setStockStatus(stockStatus);

        if (sparePart.getCategory() != null) {
            response.setCategoryId(sparePart.getCategory().getId());
            response.setCategoryName(sparePart.getCategory().getCategoryName());
        }

        if (sparePart.getSupplier() != null) {
            response.setSupplierId(sparePart.getSupplier().getId());
            response.setSupplierName(sparePart.getSupplier().getSupplierName());
        }

        response.setCreatedAt(sparePart.getCreatedAt());
        response.setUpdatedAt(sparePart.getUpdatedAt());

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

    private String getBrandColor(String brand) {
        Map<String, String> brandColors = new HashMap<>();
        brandColors.put("Michelin", "#FF6384");
        brandColors.put("Bridgestone", "#36A2EB");
        brandColors.put("Goodyear", "#FFCE56");
        brandColors.put("Yokohama", "#4BC0C0");
        brandColors.put("Pirelli", "#9966FF");
        brandColors.put("Continental", "#FF9F40");
        brandColors.put("Toyota", "#FF6B6B");
        brandColors.put("Honda", "#4ECDC4");
        brandColors.put("Ford", "#45B7D1");
        brandColors.put("BMW", "#96CEB4");
        brandColors.put("Mercedes", "#FECA57");

        return brandColors.getOrDefault(brand,
                "#" + String.format("%06x", Math.abs(brand.hashCode()) % 0xFFFFFF));
    }

    private String formatMonthKey(String monthKey) {
        // monthKey format: "2024-01"
        String[] parts = monthKey.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);

        String[] monthNames = {"Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        return monthNames[month - 1] + " " + year;
    }

    private List<Double> calculateNetStock(List<Double> income, List<Double> usage) {
        List<Double> netStock = new ArrayList<>();
        for (int i = 0; i < income.size(); i++) {
            netStock.add(income.get(i) - usage.get(i));
        }
        return netStock;
    }

    private long calculateMediumStockCount() {
        return sparePartRepository.findAll().stream()
                .filter(p -> p.getQuantity() > p.getMinQuantity() &&
                        p.getQuantity() <= p.getMinQuantity() * 2)
                .count();
    }
}