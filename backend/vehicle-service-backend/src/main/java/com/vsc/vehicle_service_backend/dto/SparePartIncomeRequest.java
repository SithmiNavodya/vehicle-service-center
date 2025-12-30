package com.vsc.vehicle_service_backend.dto;

import java.time.LocalDate;
import java.util.List;

public class SparePartIncomeRequest {
    private Long supplierId;
    private LocalDate orderDate;
    private String notes;
    private List<Item> items;

    // Getters and Setters
    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }

    // Inner Item class
    public static class Item {
        private Long sparePartId;
        private Integer quantityOrdered;
        private Integer quantityReceived;
        private Double unitPrice;
        private Double totalPrice;

        // Getters and Setters for Item
        public Long getSparePartId() { return sparePartId; }
        public void setSparePartId(Long sparePartId) { this.sparePartId = sparePartId; }

        public Integer getQuantityOrdered() { return quantityOrdered; }
        public void setQuantityOrdered(Integer quantityOrdered) { this.quantityOrdered = quantityOrdered; }

        public Integer getQuantityReceived() { return quantityReceived; }
        public void setQuantityReceived(Integer quantityReceived) { this.quantityReceived = quantityReceived; }

        public Double getUnitPrice() { return unitPrice; }
        public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

        public Double getTotalPrice() { return totalPrice; }
        public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    }
}