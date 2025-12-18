package com.vsc.vehicle_service_backend.service;  // Changed

import com.vsc.vehicle_service_backend.entity.VehicleService;
import java.util.List;

public interface ServiceService {
    VehicleService addService(VehicleService service);
    List<VehicleService> getAllServices();
    VehicleService getServiceById(Long id);
    VehicleService updateService(Long id, VehicleService service);
    void deleteService(Long id);
}