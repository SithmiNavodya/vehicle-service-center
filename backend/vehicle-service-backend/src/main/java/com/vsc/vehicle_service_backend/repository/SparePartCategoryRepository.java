package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.SparePartCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SparePartCategoryRepository extends JpaRepository<SparePartCategory, Long> {

    Optional<SparePartCategory> findByCategoryCode(String categoryCode);

    Optional<SparePartCategory> findByCategoryName(String categoryName);

    boolean existsByCategoryCode(String categoryCode);

    boolean existsByCategoryName(String categoryName);
}