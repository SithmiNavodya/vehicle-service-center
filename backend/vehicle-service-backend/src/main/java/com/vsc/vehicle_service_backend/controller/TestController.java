package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.entity.SmsLog;
import com.vsc.vehicle_service_backend.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {

    @Autowired
    private SmsService smsService;

    @PostMapping("/sms/{recordId}")
    public ResponseEntity<Map<String, Object>> testSms(@PathVariable Long recordId) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("🧪 Testing SMS for record ID: " + recordId);

            SmsLog smsLog = smsService.sendServiceCompletionSms(recordId);

            response.put("success", true);
            response.put("message", "SMS test completed");
            response.put("smsLog", smsLog != null ?
                    Map.of(
                            "id", smsLog.getId(),
                            "phone", smsLog.getPhoneNumber(),
                            "status", smsLog.getStatus()
                    ) : null);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}