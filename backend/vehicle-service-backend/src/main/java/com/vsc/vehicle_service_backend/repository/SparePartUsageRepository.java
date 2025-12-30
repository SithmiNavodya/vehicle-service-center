package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.SparePartUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SparePartUsageRepository extends JpaRepository<SparePartUsage, Long> {
    Optional<SparePartUsage> findByUsageNumber(String usageNumber);
    List<SparePartUsage> findByServiceRecordId(Long serviceRecordId);

    @Query("SELECT u FROM SparePartUsage u WHERE u.usageDate BETWEEN :startDate AND :endDate")
    List<SparePartUsage> findByUsageDateBetween(@Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate);

    // Chart data queries
    @Query("SELECT sp.brand, SUM(ui.quantityUsed) " +
            "FROM SparePartUsageItem ui " +
            "JOIN ui.sparePart sp " +
            "JOIN sp.category c " +
            "WHERE c.id = :categoryId " +
            "AND ui.usage.usageDate BETWEEN :startDate AND :endDate " +
            "GROUP BY sp.brand")
    List<Object[]> findUsageByBrandAndCategory(@Param("categoryId") Long categoryId,
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);

    @Query("SELECT DATE_FORMAT(u.usageDate, '%Y-%m'), SUM(ui.quantityUsed) " +
            "FROM SparePartUsageItem ui " +
            "JOIN ui.sparePart sp " +
            "JOIN sp.category c " +
            "JOIN ui.usage u " +
            "WHERE c.id = :categoryId " +
            "AND u.usageDate BETWEEN :startDate AND :endDate " +
            "GROUP BY DATE_FORMAT(u.usageDate, '%Y-%m') " +
            "ORDER BY DATE_FORMAT(u.usageDate, '%Y-%m')")
    List<Object[]> findMonthlyUsageByCategory(@Param("categoryId") Long categoryId,
                                              @Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate);
}