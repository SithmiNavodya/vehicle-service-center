package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.dto.SparePartIncomeRequest;
import com.vsc.vehicle_service_backend.dto.SparePartIncomeResponse;
import com.vsc.vehicle_service_backend.entity.*;
import com.vsc.vehicle_service_backend.repository.SparePartIncomeRepository;
import com.vsc.vehicle_service_backend.repository.SparePartRepository;
import com.vsc.vehicle_service_backend.repository.SupplierRepository;
import com.vsc.vehicle_service_backend.service.SparePartIncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SparePartIncomeServiceImpl implements SparePartIncomeService {

    @Autowired
    private SparePartIncomeRepository incomeRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private SparePartRepository sparePartRepository;

    @Override
    public List<SparePartIncomeResponse> getAllIncomes() {
        return incomeRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SparePartIncomeResponse getIncomeById(Long id) {
        SparePartIncome income = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income record not found with id: " + id));
        return convertToResponse(income);
    }

    @Override
    public List<SparePartIncomeResponse> getPendingIncomes() {
        return incomeRepository.findByStatus("PENDING").stream()  // Use String for now
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SparePartIncomeResponse createIncome(SparePartIncomeRequest request) {
        // Generate order number
        String orderNumber = "IN-" + System.currentTimeMillis();

        // Find supplier
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + request.getSupplierId()));

        // Create income record
        SparePartIncome income = new SparePartIncome();
        income.setOrderNumber(orderNumber);
        income.setOrderDate(request.getOrderDate() != null ? request.getOrderDate() : LocalDate.now());
        income.setSupplier(supplier);
        income.setNotes(request.getNotes());
        income.setStatus(IncomeStatus.PENDING);  // Use enum directly

        // Process items
        Double totalAmount = 0.0;
        List<SparePartIncomeItem> items = new ArrayList<>();

        for (SparePartIncomeRequest.Item itemRequest : request.getItems()) {
            SparePart sparePart = sparePartRepository.findById(itemRequest.getSparePartId())
                    .orElseThrow(() -> new RuntimeException("Spare part not found with id: " + itemRequest.getSparePartId()));

            SparePartIncomeItem item = new SparePartIncomeItem();
            item.setSparePart(sparePart);
            item.setQuantityOrdered(itemRequest.getQuantityOrdered());
            item.setQuantityReceived(itemRequest.getQuantityReceived() != null ? itemRequest.getQuantityReceived() : 0);
            item.setUnitPrice(BigDecimal.valueOf(itemRequest.getUnitPrice()));
            item.setTotalPrice(BigDecimal.valueOf(itemRequest.getTotalPrice()));
            item.setStatus(ItemStatus.PENDING);  // Use enum directly
            item.setIncome(income);

            items.add(item);
            totalAmount += itemRequest.getTotalPrice();
        }

        income.setItems(items);
        income.setTotalAmount(totalAmount);
        income.setCreatedAt(LocalDateTime.now());
        income.setUpdatedAt(LocalDateTime.now());

        SparePartIncome savedIncome = incomeRepository.save(income);
        return convertToResponse(savedIncome);
    }

    @Override
    @Transactional
    public SparePartIncomeResponse receiveIncome(Long id) {
        SparePartIncome income = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income record not found with id: " + id));

        if (!income.isPending()) {
            throw new RuntimeException("Only pending orders can be received");
        }

        income.setStatus(IncomeStatus.RECEIVED);  // Use enum directly

        // Update stock quantities
        for (SparePartIncomeItem item : income.getItems()) {
            if (item.getStatus() == ItemStatus.PENDING) {  // Use enum directly
                SparePart sparePart = item.getSparePart();
                Integer newQuantity = sparePart.getQuantity() + item.getQuantityOrdered();
                sparePart.setQuantity(newQuantity);
                sparePart.setUpdatedAt(LocalDateTime.now());
                sparePartRepository.save(sparePart);

                item.setStatus(ItemStatus.RECEIVED);  // Use enum directly
                item.setQuantityReceived(item.getQuantityOrdered());
                item.setUpdatedAt(LocalDateTime.now());
            }
        }

        income.setUpdatedAt(LocalDateTime.now());
        SparePartIncome updatedIncome = incomeRepository.save(income);
        return convertToResponse(updatedIncome);
    }

    @Override
    @Transactional
    public SparePartIncomeResponse cancelIncome(Long id) {
        SparePartIncome income = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income record not found with id: " + id));

        if (!income.isPending()) {
            throw new RuntimeException("Only pending orders can be cancelled");
        }

        income.setStatus(IncomeStatus.CANCELLED);  // Use enum directly
        income.setUpdatedAt(LocalDateTime.now());

        // Update item statuses
        for (SparePartIncomeItem item : income.getItems()) {
            if (item.getStatus() == ItemStatus.PENDING) {  // Use enum directly
                item.setStatus(ItemStatus.CANCELLED);  // Use enum directly
                item.setUpdatedAt(LocalDateTime.now());
            }
        }

        SparePartIncome updatedIncome = incomeRepository.save(income);
        return convertToResponse(updatedIncome);
    }

    @Override
    @Transactional
    public void deleteIncome(Long id) {
        SparePartIncome income = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income record not found with id: " + id));
        incomeRepository.delete(income);
    }

    @Override
    public Map<String, Object> getChartDataByCategory(Long categoryId) {
        Map<String, Object> chartData = new HashMap<>();

        // Get last 6 months data
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(6);

        // Get monthly income data - Temporarily return empty for now
        List<Object[]> monthlyIncome = new ArrayList<>(); // incomeRepository.findMonthlyIncomeByCategory(categoryId, startDate, endDate);

        // Process data for chart
        List<String> labels = monthlyIncome.stream()
                .map(row -> formatMonth((String) row[0]))
                .collect(Collectors.toList());

        List<Double> incomeData = monthlyIncome.stream()
                .map(row -> ((Number) row[1]).doubleValue())
                .collect(Collectors.toList());

        chartData.put("labels", labels);
        chartData.put("incomeData", incomeData);
        chartData.put("totalIncome", incomeData.stream().mapToDouble(Double::doubleValue).sum());

        return chartData;
    }

    private SparePartIncomeResponse convertToResponse(SparePartIncome income) {
        SparePartIncomeResponse response = new SparePartIncomeResponse();
        response.setId(income.getId());
        response.setOrderNumber(income.getOrderNumber());
        response.setOrderDate(income.getOrderDate());
        response.setSupplierId(income.getSupplier().getId());
        response.setSupplierName(income.getSupplier().getSupplierName());
        response.setTotalAmount(income.getTotalAmount() != null ? income.getTotalAmount() : 0.0);
        response.setStatus(income.getStatus().toString());
        response.setReceivedDate(income.getReceivedDate());
        response.setNotes(income.getNotes());

        // Convert items
        List<SparePartIncomeResponse.Item> items = income.getItems().stream()
                .map(item -> {
                    SparePartIncomeResponse.Item itemResponse = new SparePartIncomeResponse.Item();
                    itemResponse.setId(item.getId());
                    itemResponse.setSparePartId(item.getSparePart().getId());
                    itemResponse.setPartCode(item.getSparePart().getPartCode());
                    itemResponse.setPartName(item.getSparePart().getPartName());
                    itemResponse.setQuantityOrdered(item.getQuantityOrdered());
                    itemResponse.setQuantityReceived(item.getQuantityReceived());
                    itemResponse.setUnitPrice(item.getUnitPrice() != null ? item.getUnitPrice().doubleValue() : 0.0);
                    itemResponse.setTotalPrice(item.getTotalPrice() != null ? item.getTotalPrice().doubleValue() : 0.0);
                    itemResponse.setStatus(item.getStatus().toString());
                    return itemResponse;
                })
                .collect(Collectors.toList());

        response.setItems(items);
        response.setCreatedAt(income.getCreatedAt());
        response.setUpdatedAt(income.getUpdatedAt());
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