package com.vsc.vehicle_service_backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "spare_part_usage")
public class SparePartUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usage_number", nullable = false, unique = true)
    private String usageNumber;

    @Column(name = "usage_date", nullable = false)
    private LocalDate usageDate;

    @ManyToOne
    @JoinColumn(name = "service_record_id")
    private ServiceRecord serviceRecord;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Column(name = "technician_name")
    private String technicianName;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "total_cost", precision = 12, scale = 2)
    private BigDecimal totalCost;

    @OneToMany(mappedBy = "usage", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SparePartUsageItem> items = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public SparePartUsage() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsageNumber() {
        return usageNumber;
    }

    public void setUsageNumber(String usageNumber) {
        this.usageNumber = usageNumber;
    }

    public LocalDate getUsageDate() {
        return usageDate;
    }

    public void setUsageDate(LocalDate usageDate) {
        this.usageDate = usageDate;
    }

    public ServiceRecord getServiceRecord() {
        return serviceRecord;
    }

    public void setServiceRecord(ServiceRecord serviceRecord) {
        this.serviceRecord = serviceRecord;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public String getTechnicianName() {
        return technicianName;
    }

    public void setTechnicianName(String technicianName) {
        this.technicianName = technicianName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public List<SparePartUsageItem> getItems() {
        return items;
    }

    public void setItems(List<SparePartUsageItem> items) {
        this.items = items;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Helper methods
    public void addItem(SparePartUsageItem item) {
        items.add(item);
        item.setUsage(this);
    }

    public void removeItem(SparePartUsageItem item) {
        items.remove(item);
        item.setUsage(null);
    }

    // Calculate total cost from items
    public BigDecimal calculateTotalCost() {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }

        return items.stream()
                .map(item -> item.getTotalCost() != null ? item.getTotalCost() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Get vehicle information if available
    public String getVehicleInfo() {
        if (vehicle != null) {
            return vehicle.getVehicleNumber() + " - " + vehicle.getBrand() + " " + vehicle.getModel();
        }
        return null;
    }

    // Get service record information if available
    public String getServiceRecordInfo() {
        if (serviceRecord != null) {
            return serviceRecord.getRecordId() + " - " + serviceRecord.getServiceDate();
        }
        return null;
    }
}