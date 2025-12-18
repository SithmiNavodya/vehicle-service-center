package com.vsc.vehicle_service_backend.controller;  // Changed

import com.vsc.vehicle_service_backend.entity.VehicleService;
import com.vsc.vehicle_service_backend.service.ServiceService;  // Updated import
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:3000")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @PostMapping
    public VehicleService addService(@RequestBody VehicleService service) {
        return serviceService.addService(service);
    }

    @GetMapping
    public List<VehicleService> getAll() {
        return serviceService.getAllServices();
    }

    @GetMapping("/{id}")
    public VehicleService getById(@PathVariable Long id) {
        return serviceService.getServiceById(id);
    }

    @PutMapping("/{id}")
    public VehicleService updateService(@PathVariable Long id, @RequestBody VehicleService service) {
        return serviceService.updateService(id, service);
    }

    @DeleteMapping("/{id}")
    public String deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return "Service Deleted";
    }
}