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
import java.util.UUID;

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

        serviceRecord.setUpdatedAt(LocalDateTime.now());
        return serviceRecordRepository.save(serviceRecord);
    }

    @Override
    @Transactional
    public ServiceRecord updateServiceRecordStatus(Long id, String status) {
        Optional<ServiceRecord> optionalServiceRecord = serviceRecordRepository.findById(id);
        if (optionalServiceRecord.isEmpty()) {
            throw new RuntimeException("Service record not found with id: " + id);
        }

        ServiceRecord serviceRecord = optionalServiceRecord.get();
        String oldStatus = serviceRecord.getStatus();
        serviceRecord.setStatus(status);
        serviceRecord.setUpdatedAt(LocalDateTime.now());

        ServiceRecord updatedRecord = serviceRecordRepository.save(serviceRecord);

        // Trigger SMS when status changes to "COMPLETED"
        if ("COMPLETED".equalsIgnoreCase(status) && !"COMPLETED".equalsIgnoreCase(oldStatus)) {
            try {
                smsService.sendServiceCompletionSms(id);
                System.out.println("Auto SMS triggered for service record: " + id);
            } catch (Exception e) {
                System.err.println("Failed to send SMS: " + e.getMessage());
                // Don't throw exception - SMS failure shouldn't fail the status update
            }
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
        // Note: Your table doesn't have customer_id column,
        // so this might need to be removed or adjusted
        // For now, return all records
        return serviceRecordRepository.findAll();
    }

    @Override
    public List<ServiceRecord> getServiceRecordsByVehicleId(Long vehicleId) {
        return serviceRecordRepository.findByVehicleId(vehicleId);
    }
}