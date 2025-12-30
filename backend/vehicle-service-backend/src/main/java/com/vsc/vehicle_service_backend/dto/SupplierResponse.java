package com.vsc.vehicle_service_backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SupplierResponse {
    private Long id;
    private String supplierCode;
    private String supplierName;
    private String phone;
    private String email;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // If Lombok isn't working, add these manually:
    // public Long getId() { return id; }
    // public void setId(Long id) { this.id = id; }
    // ... and so on for all fields
}