package com.vsc.vehicle_service_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vsc.vehicle_service_backend.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SimpleAuthController.class)
class SimpleAuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    void check_ShouldReturnStatusOk() throws Exception {
        // Arrange - No need to stub anything since we're just checking if AuthService is injected
        // The controller will check if authService != null and return "INJECTED"

        // Act & Assert
        mockMvc.perform(get("/api/test/check"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("OK")))
                .andExpect(jsonPath("$.message", is("Controller is working")))
                .andExpect(jsonPath("$.authService", is("INJECTED")));

        // No verification needed since we're not calling any methods on authService
    }

    @Test
    void simpleLogin_ShouldReturnTestToken() throws Exception {
        // Arrange
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "test@example.com");
        loginRequest.put("password", "password123");

        // No need to stub authService methods since SimpleAuthController doesn't call any
        // It just returns a test token

        // Act & Assert
        mockMvc.perform(post("/api/test/simple-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", is("test-jwt-token-123")))
                .andExpect(jsonPath("$.message", is("Login successful (test)")))
                .andExpect(jsonPath("$.email", is("test@example.com")))
                .andExpect(jsonPath("$.authService", is("INJECTED")));

        // Verify that no methods were called on authService
        verifyNoInteractions(authService);
    }
}