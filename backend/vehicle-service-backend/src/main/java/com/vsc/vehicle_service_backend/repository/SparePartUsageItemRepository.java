package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.SparePart;
import com.vsc.vehicle_service_backend.entity.SparePartUsageItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SparePartUsageItemRepository extends JpaRepository<SparePartUsageItem, Long> {
    List<SparePartUsageItem> findBySparePart(SparePart sparePart);
}