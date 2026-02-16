package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.entity.ServiceRecord;
import com.vsc.vehicle_service_backend.service.ServiceRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service-record")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ServiceRecordController {

    @Autowired
    private ServiceRecordService service;

    @GetMapping
    public ResponseEntity<List<ServiceRecord>> getAllServiceRecords() {
        List<ServiceRecord> records = service.getAllServiceRecords();
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRecord> getServiceRecordById(@PathVariable Long id) {
        return service.getServiceRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createServiceRecord(@RequestBody ServiceRecord serviceRecord) {
        try {
            ServiceRecord createdRecord = service.createServiceRecord(serviceRecord);
            return ResponseEntity.ok(createdRecord);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create service record: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateServiceRecord(
            @PathVariable Long id,
            @RequestBody ServiceRecord serviceRecord) {
        try {
            ServiceRecord updatedRecord = service.updateServiceRecord(id, serviceRecord);
            return ResponseEntity.ok(updatedRecord);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update service record: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateServiceRecordStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            String newStatus = statusUpdate.get("status");
            ServiceRecord updatedRecord = service.updateServiceRecordStatus(id, newStatus);
            return ResponseEntity.ok(updatedRecord);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update status: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteServiceRecord(@PathVariable Long id) {
        try {
            service.deleteServiceRecord(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Service record deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Failed to delete: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getServiceRecordsByCustomer(@PathVariable Long customerId) {
        try {
            List<ServiceRecord> records = service.getServiceRecordsByCustomerId(customerId);
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Customer feature not implemented: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<ServiceRecord>> getServiceRecordsByVehicle(@PathVariable Long vehicleId) {
        List<ServiceRecord> records = service.getServiceRecordsByVehicleId(vehicleId);
        return ResponseEntity.ok(records);
    }

    // Remove the test endpoint for now or add proper imports
    // We'll create a separate test controller if needed
}