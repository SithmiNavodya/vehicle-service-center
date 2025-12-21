package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.dto.SmsRequest;
import com.vsc.vehicle_service_backend.entity.Customer;
import com.vsc.vehicle_service_backend.entity.SmsLog;
import com.vsc.vehicle_service_backend.entity.ServiceRecord;
import com.vsc.vehicle_service_backend.repository.CustomerRepository;
import com.vsc.vehicle_service_backend.repository.ServiceRecordRepository;
import com.vsc.vehicle_service_backend.repository.SmsLogRepository;
import com.vsc.vehicle_service_backend.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SmsServiceImpl implements SmsService {

    @Autowired
    private SmsLogRepository smsLogRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ServiceRecordRepository serviceRecordRepository;

    @Override
    @Transactional
    public SmsLog sendServiceCompletionSms(Long serviceRecordId) {
        System.out.println("🚀 [SMS] Starting sendServiceCompletionSms for record ID: " + serviceRecordId);

        try {
            // 1. Get the service record
            Optional<ServiceRecord> serviceRecordOpt = serviceRecordRepository.findById(serviceRecordId);
            if (serviceRecordOpt.isEmpty()) {
                System.err.println("❌ [SMS] Service record not found with ID: " + serviceRecordId);
                throw new RuntimeException("Service record not found with ID: " + serviceRecordId);
            }

            ServiceRecord serviceRecord = serviceRecordOpt.get();
            System.out.println("✅ [SMS] Found service record: " + serviceRecord.getRecordId());
            System.out.println("   - Customer ID: " + serviceRecord.getCustomerId());
            System.out.println("   - Status: " + serviceRecord.getStatus());
            System.out.println("   - Total Cost: " + serviceRecord.getTotalCost());

            // 2. Get customer ID from service record
            Long customerId = serviceRecord.getCustomerId();
            String phoneNumber = "+1234567890"; // Default
            String customerName = "Customer";

            // 3. Try to get the customer
            if (customerId != null) {
                Optional<Customer> customerOpt = customerRepository.findById(customerId);
                if (customerOpt.isPresent()) {
                    Customer customer = customerOpt.get();
                    customerName = customer.getName() != null ? customer.getName() : "Customer #" + customerId;
                    phoneNumber = customer.getPhone() != null ? customer.getPhone() : "+1234567890";
                    System.out.println("✅ [SMS] Found customer: " + customerName);
                    System.out.println("   - Phone: " + phoneNumber);
                } else {
                    System.err.println("⚠️ [SMS] Customer not found with ID: " + customerId + ", using defaults");
                    customerName = "Customer #" + customerId;
                }
            } else {
                System.err.println("⚠️ [SMS] No customer ID in service record, using defaults");
                customerId = 1L; // Default
            }

            // 4. Create the message
            String message;
            double totalCost = serviceRecord.getTotalCost() != null ? serviceRecord.getTotalCost() : 0.0;

            message = String.format(
                    "Dear %s, your vehicle service %s has been completed successfully. " +
                            "Total cost: Rs. %.2f. Vehicle is ready for pickup. Thank you! - VSC",
                    customerName,
                    serviceRecord.getRecordId(),
                    totalCost
            );

            System.out.println("📱 [SMS] Message: " + message);

            // 5. Create and save SMS log
            SmsLog smsLog = new SmsLog();
            smsLog.setPhoneNumber(phoneNumber);
            smsLog.setMessage(message);
            smsLog.setStatus("SENT");
            smsLog.setProvider("SYSTEM_AUTO");
            smsLog.setServiceRecordId(serviceRecordId);
            smsLog.setCustomerId(customerId);
            smsLog.setSentAt(LocalDateTime.now());

            SmsLog savedLog = smsLogRepository.save(smsLog);
            System.out.println("✅ [SMS] SMS log saved with ID: " + savedLog.getId());

            return savedLog;

        } catch (Exception e) {
            System.err.println("❌ [SMS] Error in sendServiceCompletionSms: " + e.getMessage());
            e.printStackTrace();

            // Create a failed log entry for tracking
            try {
                SmsLog failedLog = new SmsLog();
                failedLog.setPhoneNumber("UNKNOWN");
                failedLog.setMessage("Failed to send completion SMS for record: " + serviceRecordId);
                failedLog.setStatus("FAILED");
                failedLog.setProvider("SYSTEM_AUTO");
                failedLog.setErrorMessage(e.getMessage());
                failedLog.setServiceRecordId(serviceRecordId);
                failedLog.setSentAt(LocalDateTime.now());

                return smsLogRepository.save(failedLog);
            } catch (Exception ex) {
                System.err.println("❌ [SMS] Could not even save failed log: " + ex.getMessage());
                return null;
            }
        }
    }

    // ... rest of your methods remain the same
    @Override
    @Transactional
    public SmsLog sendCustomSms(SmsRequest smsRequest) {
        try {
            System.out.println("🚀 Starting sendCustomSms for customer ID: " + smsRequest.getCustomerId());

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

            System.out.println("✅ Custom SMS sent to: " + customer.getName());
            SmsLog savedLog = smsLogRepository.save(smsLog);
            System.out.println("✅ SMS log saved with ID: " + savedLog.getId());

            return savedLog;

        } catch (Exception e) {
            System.err.println("❌ Error sending custom SMS: " + e.getMessage());
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
            System.out.println("✅ SMS resent: " + id);
            return true;

        } catch (Exception e) {
            System.err.println("❌ Error resending SMS: " + e.getMessage());
            return false;
        }
    }
}