// src/main/java/com/vsc/vehicle_service_backend/repository/SparePartUsageRepository.java
package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.SparePart;
import com.vsc.vehicle_service_backend.entity.SparePartUsage;
import com.vsc.vehicle_service_backend.entity.ServiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SparePartUsageRepository extends JpaRepository<SparePartUsage, Long> {
    List<SparePartUsage> findByItems_SparePart(SparePart sparePart);
    List<SparePartUsage> findByServiceRecord(ServiceRecord serviceRecord);
    List<SparePartUsage> findByUsageDateBetween(LocalDate start, LocalDate end);
}