package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.entity.Vehicle;
import java.util.List;

public interface VehicleService {

    Vehicle addVehicle(Vehicle vehicle);

    List<Vehicle> getAllVehicles();

    Vehicle getVehicleById(Long id);

    Vehicle updateVehicle(Long id, Vehicle vehicle);

    void deleteVehicle(Long id);
}
