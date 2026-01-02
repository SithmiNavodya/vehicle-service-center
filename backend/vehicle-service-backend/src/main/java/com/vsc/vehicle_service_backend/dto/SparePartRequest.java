// src/main/java/com/vsc/vehicle_service_backend/dto/SparePartRequest.java
package com.vsc.vehicle_service_backend.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class SparePartRequest {
    @NotBlank(message = "Part name is required")
    @Size(min = 2, max = 100, message = "Part name must be between 2 and 100 characters")
    private String partName;

    private String brand;
    private String model;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Minimum quantity is required")
    @Min(value = 1, message = "Minimum quantity must be at least 1")
    private Integer minQuantity;

    private String imagePath;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;
}