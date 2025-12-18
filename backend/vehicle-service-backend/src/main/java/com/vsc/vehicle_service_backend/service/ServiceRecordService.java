package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.entity.ServiceRecord;
import java.util.List;
import java.util.Optional;

public interface ServiceRecordService {
    List<ServiceRecord> getAllServiceRecords();
    Optional<ServiceRecord> getServiceRecordById(Long id);
    ServiceRecord createServiceRecord(ServiceRecord serviceRecord);
    ServiceRecord updateServiceRecord(Long id, ServiceRecord serviceRecord);
    ServiceRecord updateServiceRecordStatus(Long id, String status); // Add this method
    void deleteServiceRecord(Long id);
    List<ServiceRecord> getServiceRecordsByCustomerId(Long customerId);
    List<ServiceRecord> getServiceRecordsByVehicleId(Long vehicleId);
}