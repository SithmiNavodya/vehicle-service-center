package com.vsc.vehicle_service_backend.dto;

import java.time.LocalDateTime;

public class SmsLogDTO {
    private Long id;
    private String phoneNumber;
    private String message;
    private String status;
    private String provider;
    private String messageId;
    private String errorMessage;
    private LocalDateTime sentAt;
    private Long serviceRecordId;
    private String recordId;
    private Long customerId;
    private String customerName;

    // Getters and Setters
    // Constructor from SmsLog entity
}