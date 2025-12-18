package com.vsc.vehicle_service_backend.repository;  // Changed

import com.vsc.vehicle_service_backend.entity.VehicleService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ServiceRepository extends JpaRepository<VehicleService, Long> {

    @Query(value = "SELECT service_id FROM services ORDER BY id DESC LIMIT 1", nativeQuery = true)
    String getLastServiceId();
}