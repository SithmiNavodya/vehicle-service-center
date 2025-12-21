package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.entity.ServiceRecord;
import com.vsc.vehicle_service_backend.repository.ServiceRecordRepository;
import com.vsc.vehicle_service_backend.service.ServiceRecordService;
import com.vsc.vehicle_service_backend.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceRecordServiceImpl implements ServiceRecordService {

    @Autowired
    private ServiceRecordRepository serviceRecordRepository;

    @Autowired
    private SmsService smsService;

    @Override
    public List<ServiceRecord> getAllServiceRecords() {
        return serviceRecordRepository.findAll();
    }

    @Override
    public Optional<ServiceRecord> getServiceRecordById(Long id) {
        return serviceRecordRepository.findById(id);
    }

    @Override
    @Transactional
    public ServiceRecord createServiceRecord(ServiceRecord serviceRecord) {
        // Generate sequential record_id like SR_1, SR_2, SR_3
        if (serviceRecord.getRecordId() == null || serviceRecord.getRecordId().isEmpty()) {
            // Find the highest existing record_id
            Long maxId = serviceRecordRepository.findAll().stream()
                    .map(rec -> {
                        String rid = rec.getRecordId();
                        if (rid != null && rid.startsWith("SR_")) {
                            try {
                                return Long.parseLong(rid.substring(3));
                            } catch (NumberFormatException e) {
                                return 0L;
                            }
                        }
                        return 0L;
                    })
                    .max(Long::compare)
                    .orElse(0L);

            // Generate next ID
            Long nextId = maxId + 1;
            String recordId = "SR_" + nextId;
            serviceRecord.setRecordId(recordId);
        }

        serviceRecord.setCreatedAt(LocalDateTime.now());
        serviceRecord.setUpdatedAt(LocalDateTime.now());

        // Set default status if not provided
        if (serviceRecord.getStatus() == null || serviceRecord.getStatus().isEmpty()) {
            serviceRecord.setStatus("PENDING");
        }

        // Validate required fields
        if (serviceRecord.getCustomerId() == null) {
            System.err.println("⚠️ WARNING: Creating service record without customer ID!");
            // For testing, set a default customer ID
            serviceRecord.setCustomerId(1L);
        }

        System.out.println("✅ Creating service record: " + serviceRecord.getRecordId());
        System.out.println("   - Customer ID: " + serviceRecord.getCustomerId());
        System.out.println("   - Vehicle ID: " + serviceRecord.getVehicleId());

        return serviceRecordRepository.save(serviceRecord);
    }

    @Override
    @Transactional
    public ServiceRecord updateServiceRecord(Long id, ServiceRecord serviceRecordDetails) {
        Optional<ServiceRecord> optionalServiceRecord = serviceRecordRepository.findById(id);
        if (optionalServiceRecord.isEmpty()) {
            throw new RuntimeException("Service record not found with id: " + id);
        }

        ServiceRecord serviceRecord = optionalServiceRecord.get();

        // Update fields - only update if provided
        if (serviceRecordDetails.getRecordId() != null) {
            serviceRecord.setRecordId(serviceRecordDetails.getRecordId());
        }
        if (serviceRecordDetails.getServiceDate() != null) {
            serviceRecord.setServiceDate(serviceRecordDetails.getServiceDate());
        }
        if (serviceRecordDetails.getNextServiceDate() != null) {
            serviceRecord.setNextServiceDate(serviceRecordDetails.getNextServiceDate());
        }
        if (serviceRecordDetails.getStatus() != null) {
            serviceRecord.setStatus(serviceRecordDetails.getStatus());
        }
        if (serviceRecordDetails.getNotes() != null) {
            serviceRecord.setNotes(serviceRecordDetails.getNotes());
        }
        if (serviceRecordDetails.getVehicleId() != null) {
            serviceRecord.setVehicleId(serviceRecordDetails.getVehicleId());
        }
        if (serviceRecordDetails.getServiceId() != null) {
            serviceRecord.setServiceId(serviceRecordDetails.getServiceId());
        }
        if (serviceRecordDetails.getCustomerId() != null) {
            serviceRecord.setCustomerId(serviceRecordDetails.getCustomerId());
        }
        if (serviceRecordDetails.getTotalCost() != null) {
            serviceRecord.setTotalCost(serviceRecordDetails.getTotalCost());
        }

        serviceRecord.setUpdatedAt(LocalDateTime.now());
        return serviceRecordRepository.save(serviceRecord);
    }

    @Override
    @Transactional
    public ServiceRecord updateServiceRecordStatus(Long id, String status) {
        System.out.println("🔄 Updating service record status");
        System.out.println("   - Record ID: " + id);
        System.out.println("   - New Status: " + status);

        Optional<ServiceRecord> optionalServiceRecord = serviceRecordRepository.findById(id);
        if (optionalServiceRecord.isEmpty()) {
            throw new RuntimeException("Service record not found with id: " + id);
        }

        ServiceRecord serviceRecord = optionalServiceRecord.get();
        String oldStatus = serviceRecord.getStatus();
        System.out.println("   - Old Status: " + oldStatus);
        System.out.println("   - Customer ID: " + serviceRecord.getCustomerId());
        System.out.println("   - Record #: " + serviceRecord.getRecordId());

        serviceRecord.setStatus(status);
        serviceRecord.setUpdatedAt(LocalDateTime.now());

        ServiceRecord updatedRecord = serviceRecordRepository.save(serviceRecord);

        // IMPORTANT: Check for both "COMPLETE" and "COMPLETED"
        boolean isCompleted = "COMPLETE".equalsIgnoreCase(status) || "COMPLETED".equalsIgnoreCase(status);
        boolean wasCompleted = "COMPLETE".equalsIgnoreCase(oldStatus) || "COMPLETED".equalsIgnoreCase(oldStatus);

        System.out.println("   - Is Completed? " + isCompleted);
        System.out.println("   - Was Completed? " + wasCompleted);

        // Trigger SMS when status changes to completed
        if (isCompleted && !wasCompleted) {
            System.out.println("🚀 Triggering SMS for completed service record #" + id);
            try {
                // Just call the SMS service, don't worry about the return value
                smsService.sendServiceCompletionSms(id);
                System.out.println("✅ SMS sent successfully!");
            } catch (Exception e) {
                System.err.println("❌ Failed to send SMS: " + e.getMessage());
                e.printStackTrace();
                // Don't throw exception - SMS failure shouldn't fail the status update
            }
        } else {
            System.out.println("⏭️ Skipping SMS (not a completion status change)");
        }

        return updatedRecord;
    }

    @Override
    @Transactional
    public void deleteServiceRecord(Long id) {
        serviceRecordRepository.deleteById(id);
    }

    @Override
    public List<ServiceRecord> getServiceRecordsByCustomerId(Long customerId) {
        return serviceRecordRepository.findByCustomerId(customerId);
    }

    @Override
    public List<ServiceRecord> getServiceRecordsByVehicleId(Long vehicleId) {
        return serviceRecordRepository.findByVehicleId(vehicleId);
    }
}
