package com.vsc.vehicle_service_backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class VehicleRequest {
    
    @NotBlank(message = "Vehicle number is required")
    private String vehicleNumber;
    
    @NotBlank(message = "Brand is required")
    private String brand;
    
    @NotBlank(message = "Model is required")
    private String model;
    
    @NotBlank(message = "Vehicle type is required")
    private String vehicleType;
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
}
