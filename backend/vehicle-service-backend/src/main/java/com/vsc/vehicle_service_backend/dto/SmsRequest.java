package com.vsc.vehicle_service_backend.dto;

public class SmsRequest {
    private Long customerId;
    private String message;

    // Constructors
    public SmsRequest() {}

    public SmsRequest(Long customerId, String message) {
        this.customerId = customerId;
        this.message = message;
    }

    // Getters and Setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}