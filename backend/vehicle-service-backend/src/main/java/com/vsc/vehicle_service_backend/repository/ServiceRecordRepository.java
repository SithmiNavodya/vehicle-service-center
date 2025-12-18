package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.ServiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRecordRepository extends JpaRepository<ServiceRecord, Long> {

    // Find by vehicle_id
    List<ServiceRecord> findByVehicleId(Long vehicleId);

    // Find by status
    List<ServiceRecord> findByStatus(String status);

    // Find by vehicle_id and status
    List<ServiceRecord> findByVehicleIdAndStatus(Long vehicleId, String status);

    // Find by record_id
    ServiceRecord findByRecordId(String recordId);

    // For counting records by status (needed for statistics)
    Long countByStatus(String status);
}