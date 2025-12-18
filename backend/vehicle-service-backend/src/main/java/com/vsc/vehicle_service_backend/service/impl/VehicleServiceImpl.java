package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.entity.Vehicle;
import com.vsc.vehicle_service_backend.repository.VehicleRepository;
import com.vsc.vehicle_service_backend.service.VehicleService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository repository;

    public VehicleServiceImpl(VehicleRepository repository) {
        this.repository = repository;
    }

    private String generateVehicleId() {
        String lastId = repository.getLastVehicleId();
        if (lastId == null) return "vh_1";

        int num = Integer.parseInt(lastId.split("_")[1]);
        return "vh_" + (num + 1);
    }

    @Override
    public Vehicle addVehicle(Vehicle vehicle) {
        vehicle.setVehicleId(generateVehicleId());
        return repository.save(vehicle);
    }

    @Override
    public List<Vehicle> getAllVehicles() {
        return repository.findAll();
    }

    @Override
    public Vehicle getVehicleById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Vehicle updateVehicle(Long id, Vehicle newVehicle) {
        return repository.findById(id).map(v -> {
            v.setVehicleNumber(newVehicle.getVehicleNumber());
            v.setBrand(newVehicle.getBrand());
            v.setModel(newVehicle.getModel());
            v.setVehicleType(newVehicle.getVehicleType());
            return repository.save(v);
        }).orElse(null);
    }

    @Override
    public void deleteVehicle(Long id) {
        repository.deleteById(id);
    }
}
