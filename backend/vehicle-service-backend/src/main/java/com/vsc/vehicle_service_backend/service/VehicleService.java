package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.dto.VehicleRequest;
import com.vsc.vehicle_service_backend.dto.VehicleResponse;
import com.vsc.vehicle_service_backend.entity.Vehicle;
import java.util.List;

public interface VehicleService {

    VehicleResponse addVehicle(VehicleRequest request);

    List<VehicleResponse> getAllVehicles();

    VehicleResponse getVehicleById(Long id);

    VehicleResponse updateVehicle(Long id, VehicleRequest request);

    void deleteVehicle(Long id);
}
