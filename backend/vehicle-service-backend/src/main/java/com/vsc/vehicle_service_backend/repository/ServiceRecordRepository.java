package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.ServiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRecordRepository extends JpaRepository<ServiceRecord, Long> {

    // Find by record_id (SR_1, SR_2, etc.)
    Optional<ServiceRecord> findByRecordId(String recordId);

    // Find by customer ID
    List<ServiceRecord> findByCustomerId(Long customerId);

    // Find by vehicle ID
    List<ServiceRecord> findByVehicleId(Long vehicleId);

    // Find by status
    List<ServiceRecord> findByStatus(String status);

    // Find by status order by created date
    List<ServiceRecord> findByStatusOrderByCreatedAtDesc(String status);

    // Check if record ID exists
    boolean existsByRecordId(String recordId);

    // Find all ordered by created date
    List<ServiceRecord> findAllByOrderByCreatedAtDesc();

    // Find all by customer ID ordered by created date
    List<ServiceRecord> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}