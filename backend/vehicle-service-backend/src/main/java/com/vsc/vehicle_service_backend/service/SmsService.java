package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.dto.SmsRequest;
import com.vsc.vehicle_service_backend.entity.SmsLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface SmsService {
    // Send SMS
    SmsLog sendServiceCompletionSms(Long serviceRecordId);
    SmsLog sendCustomSms(SmsRequest smsRequest);

    // Get SMS logs
    List<SmsLog> getSmsHistoryByCustomerId(Long customerId);
    List<SmsLog> getSmsHistoryByRecordId(Long recordId);
    List<SmsLog> getAllSmsLogs();
    Page<SmsLog> getSmsLogsPage(Pageable pageable);
    Page<SmsLog> searchSmsLogs(String phoneNumber, String status, Long customerId, Pageable pageable);

    // Statistics
    Map<String, Object> getSmsStats();

    // Actions
    boolean resendSms(Long id);
}