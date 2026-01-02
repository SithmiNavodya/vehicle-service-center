package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.SparePartCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SparePartCategoryRepository extends JpaRepository<SparePartCategory, Long> {
    boolean existsByCategoryCode(String categoryCode);
    List<SparePartCategory> findByCategoryNameContainingIgnoreCaseOrCategoryCodeContainingIgnoreCase(
            String categoryName, String categoryCode);
}