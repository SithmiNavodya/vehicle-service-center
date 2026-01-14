package com.vsc.vehicle_service_backend.exception;

//public class ResourceNotFoundException extends RuntimeException {
//    public ResourceNotFoundException(String message) {
//        super(message);
//    }
//}


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}