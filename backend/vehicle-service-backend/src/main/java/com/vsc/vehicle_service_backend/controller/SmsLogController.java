package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.dto.SmsRequest;
import com.vsc.vehicle_service_backend.entity.SmsLog;
import com.vsc.vehicle_service_backend.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sms-log")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"}) // Allow both ports
public class SmsLogController {

    @Autowired
    private SmsService smsService;

    @GetMapping
    public ResponseEntity<List<SmsLog>> getAllSmsLogs() {
        List<SmsLog> logs = smsService.getAllSmsLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> getSmsLogsPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long customerId) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("sentAt").descending());
        Page<SmsLog> smsPage = smsService.searchSmsLogs(phoneNumber, status, customerId, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", smsPage.getContent());
        response.put("currentPage", smsPage.getNumber());
        response.put("totalItems", smsPage.getTotalElements());
        response.put("totalPages", smsPage.getTotalPages());
        response.put("pageSize", size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<SmsLog>> getSmsByCustomer(@PathVariable Long customerId) {
        List<SmsLog> logs = smsService.getSmsHistoryByCustomerId(customerId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/record/{recordId}")
    public ResponseEntity<List<SmsLog>> getSmsByRecord(@PathVariable Long recordId) {
        List<SmsLog> logs = smsService.getSmsHistoryByRecordId(recordId);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/send")
    public ResponseEntity<SmsLog> sendCustomSms(@RequestBody SmsRequest smsRequest) {
        SmsLog smsLog = smsService.sendCustomSms(smsRequest);
        return ResponseEntity.ok(smsLog);
    }

    @PostMapping("/resend/{id}")
    public ResponseEntity<Map<String, Object>> resendSms(@PathVariable Long id) {
        boolean success = smsService.resendSms(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", success ? "SMS resent successfully" : "Failed to resend SMS");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = smsService.getSmsStats();
        return ResponseEntity.ok(stats);
    }

    // Add a test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("SMS Log API is working!");
    }
}