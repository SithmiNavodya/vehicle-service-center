package com.vsc.vehicle_service_backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "services")
public class VehicleService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_id", nullable = false, unique = true)  // Added name attribute
    private String serviceId; // sv_1, sv_2...

    @Column(nullable = false)
    private String serviceName;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private String estimatedTime;

    @Column(columnDefinition = "TEXT")
    private String description;

    public VehicleService() {}

    public Long getId() { return id; }

    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getEstimatedTime() { return estimatedTime; }
    public void setEstimatedTime(String estimatedTime) { this.estimatedTime = estimatedTime; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
