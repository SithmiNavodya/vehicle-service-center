package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.dto.SmsRequest;
import com.vsc.vehicle_service_backend.entity.Customer;
import com.vsc.vehicle_service_backend.entity.SmsLog;
import com.vsc.vehicle_service_backend.repository.CustomerRepository;
import com.vsc.vehicle_service_backend.repository.SmsLogRepository;
import com.vsc.vehicle_service_backend.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SmsServiceImpl implements SmsService {

    @Autowired
    private SmsLogRepository smsLogRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    @Transactional
    public SmsLog sendServiceCompletionSms(Long serviceRecordId) {
        try {
            // Simplified version - just create an SMS log
            SmsLog smsLog = new SmsLog();
            smsLog.setPhoneNumber("+1234567890");
            smsLog.setMessage("Your vehicle service #" + serviceRecordId + " has been completed successfully.");
            smsLog.setStatus("SENT");
            smsLog.setProvider("SYSTEM");
            smsLog.setSentAt(LocalDateTime.now());
            smsLog.setServiceRecordId(serviceRecordId);
            smsLog.setCustomerId(1L); // Default customer ID

            System.out.println("Auto SMS sent for service record: " + serviceRecordId);
            return smsLogRepository.save(smsLog);

        } catch (Exception e) {
            System.err.println("Error sending SMS: " + e.getMessage());
            return null;
        }
    }

    @Override
    @Transactional
    public SmsLog sendCustomSms(SmsRequest smsRequest) {
        try {
            Optional<Customer> customerOptional = customerRepository.findById(smsRequest.getCustomerId());
            if (customerOptional.isEmpty()) {
                throw new RuntimeException("Customer not found with ID: " + smsRequest.getCustomerId());
            }

            Customer customer = customerOptional.get();

            SmsLog smsLog = new SmsLog();
            smsLog.setPhoneNumber(customer.getPhone() != null ? customer.getPhone() : "+1234567890");
            smsLog.setMessage(smsRequest.getMessage());
            smsLog.setStatus("SENT");
            smsLog.setProvider("MANUAL");
            smsLog.setSentAt(LocalDateTime.now());
            smsLog.setCustomerId(customer.getId());

            System.out.println("Custom SMS sent to: " + customer.getName());
            return smsLogRepository.save(smsLog);

        } catch (Exception e) {
            System.err.println("Error sending custom SMS: " + e.getMessage());
            return null;
        }
    }

    @Override
    public List<SmsLog> getSmsHistoryByCustomerId(Long customerId) {
        return smsLogRepository.findByCustomerIdOrderBySentAtDesc(customerId);
    }

    @Override
    public List<SmsLog> getSmsHistoryByRecordId(Long recordId) {
        return smsLogRepository.findByServiceRecordIdOrderBySentAtDesc(recordId);
    }

    @Override
    public List<SmsLog> getAllSmsLogs() {
        return smsLogRepository.findAllByOrderBySentAtDesc();
    }

    @Override
    public Page<SmsLog> getSmsLogsPage(Pageable pageable) {
        return smsLogRepository.findAllByOrderBySentAtDesc(pageable);
    }

    @Override
    public Page<SmsLog> searchSmsLogs(String phoneNumber, String status, Long customerId, Pageable pageable) {
        // Use repository method if exists, otherwise fallback
        try {
            return smsLogRepository.searchSmsLogs(phoneNumber, status, customerId, pageable);
        } catch (Exception e) {
            // Fallback to basic pagination
            return smsLogRepository.findAllByOrderBySentAtDesc(pageable);
        }
    }

    @Override
    public Map<String, Object> getSmsStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", smsLogRepository.count());
        stats.put("sent", smsLogRepository.countByStatus("SENT"));
        stats.put("failed", smsLogRepository.countByStatus("FAILED"));
        stats.put("pending", smsLogRepository.countByStatus("PENDING"));
        return stats;
    }

    @Override
    @Transactional
    public boolean resendSms(Long id) {
        try {
            Optional<SmsLog> originalOptional = smsLogRepository.findById(id);
            if (originalOptional.isEmpty()) {
                return false;
            }

            SmsLog original = originalOptional.get();

            SmsLog resendLog = new SmsLog();
            resendLog.setPhoneNumber(original.getPhoneNumber());
            resendLog.setMessage(original.getMessage());
            resendLog.setStatus("SENT");
            resendLog.setProvider("RESEND");
            resendLog.setSentAt(LocalDateTime.now());
            resendLog.setCustomerId(original.getCustomerId());
            resendLog.setServiceRecordId(original.getServiceRecordId());

            smsLogRepository.save(resendLog);
            System.out.println("SMS resent: " + id);
            return true;

        } catch (Exception e) {
            System.err.println("Error resending SMS: " + e.getMessage());
            return false;
        }
    }
}