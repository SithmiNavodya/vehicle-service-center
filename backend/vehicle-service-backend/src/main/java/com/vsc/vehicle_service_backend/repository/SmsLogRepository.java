package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.SmsLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SmsLogRepository extends JpaRepository<SmsLog, Long> {

    // Find by customer ID
    List<SmsLog> findByCustomerId(Long customerId);
    List<SmsLog> findByCustomerIdOrderBySentAtDesc(Long customerId);

    // Find by service record ID
    List<SmsLog> findByServiceRecordId(Long recordId);
    List<SmsLog> findByServiceRecordIdOrderBySentAtDesc(Long recordId);

    // Find all ordered by sent date
    List<SmsLog> findAllByOrderBySentAtDesc();
    Page<SmsLog> findAllByOrderBySentAtDesc(Pageable pageable);

    // Count by status
    int countByStatus(String status);

    // Search with filters - FIXED VERSION
    @Query("SELECT s FROM SmsLog s WHERE " +
            "(COALESCE(:phoneNumber, '') = '' OR s.phoneNumber LIKE %:phoneNumber%) AND " +
            "(COALESCE(:status, '') = '' OR s.status = :status) AND " +
            "(:customerId IS NULL OR s.customerId = :customerId)")
    Page<SmsLog> searchSmsLogs(
            @Param("phoneNumber") String phoneNumber,
            @Param("status") String status,
            @Param("customerId") Long customerId,
            Pageable pageable
    );
}