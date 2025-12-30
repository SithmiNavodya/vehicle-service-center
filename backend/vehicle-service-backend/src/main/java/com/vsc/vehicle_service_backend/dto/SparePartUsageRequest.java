package com.vsc.vehicle_service_backend.dto;

import java.time.LocalDate;
import java.util.List;

public class SparePartUsageRequest {
    private Long serviceRecordId;
    private Long vehicleId;
    private LocalDate usageDate;
    private String technicianName;
    private String notes;
    private List<Item> items;

    // Getters and Setters
    public Long getServiceRecordId() { return serviceRecordId; }
    public void setServiceRecordId(Long serviceRecordId) { this.serviceRecordId = serviceRecordId; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public LocalDate getUsageDate() { return usageDate; }
    public void setUsageDate(LocalDate usageDate) { this.usageDate = usageDate; }

    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }

    // Inner Item class
    public static class Item {
        private Long sparePartId;
        private Integer quantityUsed;
        private Double unitCost;
        private Double totalCost;

        // Getters and Setters for Item
        public Long getSparePartId() { return sparePartId; }
        public void setSparePartId(Long sparePartId) { this.sparePartId = sparePartId; }

        public Integer getQuantityUsed() { return quantityUsed; }
        public void setQuantityUsed(Integer quantityUsed) { this.quantityUsed = quantityUsed; }

        public Double getUnitCost() { return unitCost; }
        public void setUnitCost(Double unitCost) { this.unitCost = unitCost; }

        public Double getTotalCost() { return totalCost; }
        public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }
    }
}