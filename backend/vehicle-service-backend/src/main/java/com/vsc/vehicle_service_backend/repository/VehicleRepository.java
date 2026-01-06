package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query(value = "SELECT vehicle_id FROM vehicles ORDER BY id DESC LIMIT 1", nativeQuery = true)
    String getLastVehicleId();

}
