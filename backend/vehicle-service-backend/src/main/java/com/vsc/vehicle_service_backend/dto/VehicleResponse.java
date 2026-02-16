package com.vsc.vehicle_service_backend.dto;

import lombok.Data;

@Data
public class VehicleResponse {
    private Long id;
    private String vehicleId;
    private String vehicleNumber;
    private String brand;
    private String model;
    private String vehicleType;
    private Long customerId;
    private String customerName;
}
