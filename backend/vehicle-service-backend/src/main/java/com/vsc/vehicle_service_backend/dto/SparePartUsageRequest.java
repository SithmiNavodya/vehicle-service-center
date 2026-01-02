// src/main/java/com/vsc/vehicle_service_backend/dto/SparePartUsageRequest.java
package com.vsc.vehicle_service_backend.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class SparePartUsageRequest {
    @NotNull(message = "Spare part ID is required")
    private Long sparePartId;

    @NotNull(message = "Quantity used is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantityUsed;

    @NotNull(message = "Unit price is required")
    @Positive(message = "Unit price must be positive")
    private Double unitPrice;

    private Long serviceRecordId;
    private Long vehicleId;
    private String technicianName;
    private String notes;
}