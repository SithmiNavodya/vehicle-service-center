// src/main/java/com/vsc/vehicle_service_backend/repository/SparePartRepository.java
package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.SparePart;
import com.vsc.vehicle_service_backend.entity.SparePartCategory;
import com.vsc.vehicle_service_backend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {
    Optional<SparePart> findTopByOrderByIdDesc();

    // Find by category object
    List<SparePart> findByCategory(SparePartCategory category);

    // Find by category ID (add this method)
    List<SparePart> findByCategoryId(Long categoryId);

    // Find by supplier object
    List<SparePart> findBySupplier(Supplier supplier);

    // Search methods
    List<SparePart> findByPartCodeContainingIgnoreCaseOrPartNameContainingIgnoreCase(String partCode, String partName);

    // Additional search methods
    List<SparePart> findByBrandContainingIgnoreCase(String brand);
    List<SparePart> findByModelContainingIgnoreCase(String model);
}