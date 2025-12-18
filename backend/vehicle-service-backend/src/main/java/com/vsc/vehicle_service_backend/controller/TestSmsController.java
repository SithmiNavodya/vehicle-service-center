package com.vsc.vehicle_service_backend.controller;

import com.vsc.vehicle_service_backend.service.SmsService;
import com.vsc.vehicle_service_backend.entity.ServiceRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestSmsController {

    @Autowired
    private SmsService smsService;

    // Test SMS with dummy data
    @PostMapping("/sms")
    public Map<String, String> testSms(@RequestParam String phone) {
        Map<String, String> response = new HashMap<>();

        try {
            // Create dummy service record for testing
            ServiceRecord dummyRecord = new ServiceRecord();

            // You'll need to set up minimal data
            // This is just for testing

            response.put("status", "success");
            response.put("message", "Test endpoint ready");
            response.put("phone", phone);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }

        return response;
    }

    // Format Sri Lankan phone number
    @GetMapping("/format-phone")
    public Map<String, String> formatPhone(@RequestParam String phone) {
        Map<String, String> response = new HashMap<>();

        String formatted = formatSriLankanPhone(phone);

        response.put("original", phone);
        response.put("formatted", formatted);
        response.put("network", detectNetwork(phone));

        return response;
    }

    private String formatSriLankanPhone(String phone) {
        String cleaned = phone.replaceAll("[^0-9]", "");

        if (cleaned.startsWith("0") && cleaned.length() == 10) {
            return "+94" + cleaned.substring(1);
        } else if (cleaned.startsWith("94") && cleaned.length() == 11) {
            return "+" + cleaned;
        } else if (cleaned.length() == 9) {
            return "+94" + cleaned;
        }

        return phone;
    }

    private String detectNetwork(String phone) {
        String cleaned = phone.replaceAll("[^0-9]", "");

        if (cleaned.length() >= 2) {
            String prefix;
            if (cleaned.startsWith("0") && cleaned.length() >= 3) {
                prefix = cleaned.substring(1, 3);
            } else if (cleaned.startsWith("94") && cleaned.length() >= 4) {
                prefix = cleaned.substring(2, 4);
            } else if (cleaned.length() >= 2) {
                prefix = cleaned.substring(0, 2);
            } else {
                return "UNKNOWN";
            }

            // Sri Lankan network prefixes
            if (prefix.equals("70") || prefix.equals("77") || prefix.equals("76")) {
                return "Dialog";
            } else if (prefix.equals("71") || prefix.equals("72")) {
                return "Mobitel";
            } else if (prefix.equals("78")) {
                return "Hutch";
            } else if (prefix.equals("75")) {
                return "Airtel";
            }
        }

        return "UNKNOWN";
    }
}