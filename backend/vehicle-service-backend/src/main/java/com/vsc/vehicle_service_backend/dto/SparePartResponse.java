// src/main/java/com/vsc/vehicle_service_backend/dto/SparePartResponse.java
package com.vsc.vehicle_service_backend.dto;

import com.vsc.vehicle_service_backend.entity.SparePart;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SparePartResponse {
    private Long id;
    private String partCode;
    private String partName;
    private String brand;
    private String model;
    private Double price;
    private Integer quantity;
    private Integer minQuantity;
    private String imagePath;
    private String stockStatus;  // ADD THIS FIELD
    private LocalDateTime createdAt;  // ADD THIS FIELD
    private LocalDateTime updatedAt;  // ADD THIS FIELD

    private Long categoryId;
    private String categoryCode;
    private String categoryName;

    private Long supplierId;
    private String supplierCode;
    private String supplierName;

    // Constructor with entity
    public SparePartResponse(SparePart sparePart) {
        this.id = sparePart.getId();
        this.partCode = sparePart.getPartCode();
        this.partName = sparePart.getPartName();
        this.brand = sparePart.getBrand();
        this.model = sparePart.getModel();
        this.price = sparePart.getPrice();
        this.quantity = sparePart.getQuantity();
        this.minQuantity = sparePart.getMinQuantity();
        this.imagePath = sparePart.getImagePath();
        this.createdAt = sparePart.getCreatedAt();
        this.updatedAt = sparePart.getUpdatedAt();

        // Calculate stock status
        if (sparePart.getQuantity() <= sparePart.getMinQuantity()) {
            this.stockStatus = "LOW";
        } else if (sparePart.getQuantity() <= sparePart.getMinQuantity() * 2) {
            this.stockStatus = "MEDIUM";
        } else {
            this.stockStatus = "HIGH";
        }

        if (sparePart.getCategory() != null) {
            this.categoryId = sparePart.getCategory().getId();
            this.categoryCode = sparePart.getCategory().getCategoryCode();
            this.categoryName = sparePart.getCategory().getCategoryName();
        }

        if (sparePart.getSupplier() != null) {
            this.supplierId = sparePart.getSupplier().getId();
            this.supplierCode = sparePart.getSupplier().getSupplierCode();
            this.supplierName = sparePart.getSupplier().getSupplierName();
        }
    }
}