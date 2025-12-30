package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findBySupplierCode(String supplierCode);
    List<Supplier> findBySupplierNameContainingIgnoreCase(String name);
    boolean existsBySupplierCode(String supplierCode);
    boolean existsByEmail(String email);
}