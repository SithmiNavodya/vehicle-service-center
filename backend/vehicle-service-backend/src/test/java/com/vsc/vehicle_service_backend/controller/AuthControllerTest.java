package com.vsc.vehicle_service_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vsc.vehicle_service_backend.dto.AuthResponse;
import com.vsc.vehicle_service_backend.dto.LoginRequest;
import com.vsc.vehicle_service_backend.dto.RegisterRequest;
import com.vsc.vehicle_service_backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private AuthResponse successResponse;
    private AuthResponse errorResponse;

    @BeforeEach
    void setUp() {
        // Setup Register Request
        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setPhone("1234567890");

        // Setup Login Request
        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        // Setup Success Response
        successResponse = AuthResponse.builder()
                .token("test-jwt-token")
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .role("USER")
                .message("Success")
                .build();

        // Setup Error Response
        errorResponse = AuthResponse.builder()
                .message("Email already registered")
                .build();
    }

    @Test
    void register_WithValidData_ShouldReturnSuccess() throws Exception {
        // Arrange
        when(authService.register(any(RegisterRequest.class))).thenReturn(successResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", is("test-jwt-token")))
                .andExpect(jsonPath("$.email", is("test@example.com")))
                .andExpect(jsonPath("$.firstName", is("John")))
                .andExpect(jsonPath("$.lastName", is("Doe")))
                .andExpect(jsonPath("$.role", is("USER")))
                .andExpect(jsonPath("$.message", is("Success")));

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    void register_WithExistingEmail_ShouldReturnErrorMessage() throws Exception {
        // Arrange
        when(authService.register(any(RegisterRequest.class))).thenReturn(errorResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").doesNotExist())
                .andExpect(jsonPath("$.message", is("Email already registered")));

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    void register_WhenServiceThrowsException_ShouldReturnServerError() throws Exception {
        // Arrange
        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message", containsString("Server error")));

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    void login_WithValidCredentials_ShouldReturnSuccess() throws Exception {
        // Arrange
        when(authService.login(any(LoginRequest.class))).thenReturn(successResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", is("test-jwt-token")))
                .andExpect(jsonPath("$.email", is("test@example.com")))
                .andExpect(jsonPath("$.firstName", is("John")))
                .andExpect(jsonPath("$.lastName", is("Doe")))
                .andExpect(jsonPath("$.message", is("Success")));

        verify(authService, times(1)).login(any(LoginRequest.class));
    }

    @Test
    void login_WithInvalidCredentials_ShouldReturnErrorMessage() throws Exception {
        // Arrange
        AuthResponse invalidResponse = AuthResponse.builder()
                .message("Invalid email or password")
                .build();
        when(authService.login(any(LoginRequest.class))).thenReturn(invalidResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").doesNotExist())
                .andExpect(jsonPath("$.message", is("Invalid email or password")));

        verify(authService, times(1)).login(any(LoginRequest.class));
    }

    @Test
    void login_WhenServiceThrowsException_ShouldReturnServerError() throws Exception {
        // Arrange
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message", containsString("Server error")));

        verify(authService, times(1)).login(any(LoginRequest.class));
    }

    @Test
    void test_ShouldReturnSuccess() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/auth/test"))
                .andExpect(status().isOk())
                .andExpect(content().string("Auth endpoint working"));
    }

    @Test
    void health_ShouldReturnSuccess() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/auth/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("Auth controller is healthy"));
    }

    @Test
    void cors_ShouldAllowOrigins() throws Exception {
        // Test CORS configuration
        mockMvc.perform(options("/api/auth/register")
                        .header("Origin", "http://localhost:3000")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }
}