package com.vsc.vehicle_service_backend.service.impl;  // Changed

import com.vsc.vehicle_service_backend.entity.VehicleService;
import com.vsc.vehicle_service_backend.repository.ServiceRepository;  // Updated import
import com.vsc.vehicle_service_backend.service.ServiceService;  // Updated import
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository repository;

    public ServiceServiceImpl(ServiceRepository repository) {
        this.repository = repository;
    }

    private String generateServiceId() {
        String lastId = repository.getLastServiceId(); // ex: sv_12

        if (lastId == null) return "sv_1";

        int number = Integer.parseInt(lastId.split("_")[1]);
        return "sv_" + (number + 1);
    }

    @Override
    public VehicleService addService(VehicleService service) {
        service.setServiceId(generateServiceId());
        return repository.save(service);
    }

    @Override
    public List<VehicleService> getAllServices() {
        return repository.findAll();
    }

    @Override
    public VehicleService getServiceById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public VehicleService updateService(Long id, VehicleService newService) {
        return repository.findById(id).map(s -> {
            s.setServiceName(newService.getServiceName());
            s.setDescription(newService.getDescription());
            s.setPrice(newService.getPrice());
            s.setEstimatedTime(newService.getEstimatedTime());
            return repository.save(s);
        }).orElse(null);
    }

    @Override
    public void deleteService(Long id) {
        repository.deleteById(id);
    }
}