package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.SparePart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {
    Optional<SparePart> findByPartCode(String partCode);
    List<SparePart> findByCategoryId(Long categoryId);
    List<SparePart> findBySupplierId(Long supplierId);

    @Query("SELECT p FROM SparePart p WHERE p.quantity <= p.minQuantity")
    List<SparePart> findLowStockParts();

    @Query("SELECT p FROM SparePart p WHERE LOWER(p.partName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<SparePart> searchParts(@Param("search") String search);

    boolean existsByPartCode(String partCode);
}