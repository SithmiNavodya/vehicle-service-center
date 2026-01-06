package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.dto.SparePartIncomeRequest;
import com.vsc.vehicle_service_backend.dto.SparePartIncomeResponse;
import com.vsc.vehicle_service_backend.entity.*;
import com.vsc.vehicle_service_backend.entity.IncomeStatus;
import com.vsc.vehicle_service_backend.entity.ItemStatus;
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
import java.time.format.DateTimeFormatter;
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

    private static final DateTimeFormatter ORDER_NUMBER_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

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
        return incomeRepository.findByStatus(IncomeStatus.PENDING).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SparePartIncomeResponse createIncome(SparePartIncomeRequest request) {
        // Generate order number like PO_20240115_001
        String orderNumber = generateOrderNumber();

        System.out.println("📝 Generating order number: " + orderNumber);

        // Find supplier
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + request.getSupplierId()));

        // Create income record
        SparePartIncome income = new SparePartIncome();
        income.setOrderNumber(orderNumber);
        income.setOrderDate(request.getOrderDate() != null ? request.getOrderDate() : LocalDate.now());
        income.setSupplier(supplier);
        income.setNotes(request.getNotes());
        income.setStatus(IncomeStatus.PENDING);
        income.setCreatedAt(LocalDateTime.now());
        income.setUpdatedAt(LocalDateTime.now());

        // Process items
        BigDecimal totalAmount = BigDecimal.ZERO;
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
            item.setStatus(ItemStatus.PENDING);
            item.setIncome(income);
            item.setCreatedAt(LocalDateTime.now());
            item.setUpdatedAt(LocalDateTime.now());

            items.add(item);
            totalAmount = totalAmount.add(BigDecimal.valueOf(itemRequest.getTotalPrice()));
        }

        income.setItems(items);
        income.setTotalAmount(totalAmount.doubleValue());

        System.out.println("💾 Saving income with " + items.size() + " items, total: " + totalAmount);

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

        income.setStatus(IncomeStatus.RECEIVED);
        income.setReceivedDate(LocalDate.now());

        // Update stock quantities
        for (SparePartIncomeItem item : income.getItems()) {
            if (item.getStatus() == ItemStatus.PENDING) {
                SparePart sparePart = item.getSparePart();
                Integer newQuantity = sparePart.getQuantity() + item.getQuantityOrdered();
                sparePart.setQuantity(newQuantity);
                sparePart.setUpdatedAt(LocalDateTime.now());
                sparePartRepository.save(sparePart);

                item.setStatus(ItemStatus.RECEIVED);
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

        income.setStatus(IncomeStatus.CANCELLED);
        income.setUpdatedAt(LocalDateTime.now());

        // Update item statuses
        for (SparePartIncomeItem item : income.getItems()) {
            if (item.getStatus() == ItemStatus.PENDING) {
                item.setStatus(ItemStatus.CANCELLED);
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

        // Get monthly income data - Simplified for now
        List<Object[]> monthlyIncome = new ArrayList<>();

        // Generate sample data for testing
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun"};
        for (int i = 0; i < months.length; i++) {
            Object[] monthData = new Object[2];
            monthData[0] = months[i] + " " + endDate.getYear();
            monthData[1] = (int)(Math.random() * 100000) + 50000; // Random amount
            monthlyIncome.add(monthData);
        }

        // Process data for chart
        List<String> labels = monthlyIncome.stream()
                .map(row -> (String) row[0])
                .collect(Collectors.toList());

        List<Double> incomeData = monthlyIncome.stream()
                .map(row -> ((Number) row[1]).doubleValue())
                .collect(Collectors.toList());

        chartData.put("labels", labels);
        chartData.put("incomeData", incomeData);
        chartData.put("totalIncome", incomeData.stream().mapToDouble(Double::doubleValue).sum());

        return chartData;
    }

    private String generateOrderNumber() {
        // Format: PO_YYYYMMDD_XXX
        String datePart = LocalDate.now().format(ORDER_NUMBER_FORMATTER);

        // Get count of today's orders
        LocalDate today = LocalDate.now();

        // FIX: If countByOrderDate doesn't work, use this alternative:
        long countToday;
        try {
            countToday = incomeRepository.countByOrderDate(today);
        } catch (Exception e) {
            // Alternative: Count manually
            countToday = incomeRepository.findByOrderDateBetween(
                    today.atStartOfDay().toLocalDate(),
                    today.atTime(23, 59, 59).toLocalDate()
            ).size();
        }

        // Generate sequence number (001, 002, etc.)
        String sequence = String.format("%03d", countToday + 1);

        return "PO_" + datePart + "_" + sequence;
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
        if (income.getItems() != null) {
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
        } else {
            response.setItems(new ArrayList<>());
        }

        response.setCreatedAt(income.getCreatedAt());
        response.setUpdatedAt(income.getUpdatedAt());
        return response;
    }
}