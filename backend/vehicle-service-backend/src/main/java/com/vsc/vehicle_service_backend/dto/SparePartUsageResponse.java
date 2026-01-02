// src/main/java/com/vsc/vehicle_service_backend/dto/SparePartUsageResponse.java
package com.vsc.vehicle_service_backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SparePartUsageResponse {
    private Long id;
    private String usageNumber;
    private LocalDate usageDate;
    private Long sparePartId;
    private String sparePartCode;
    private String sparePartName;
    private Integer quantityUsed;
    private Double unitPrice;
    private Long serviceRecordId; // Changed from serviceJobId
    private Long vehicleId;
    private String vehicleInfo;
    private String technicianName;
    private String notes;
    private Double totalCost;
    private LocalDateTime createdAt;
}