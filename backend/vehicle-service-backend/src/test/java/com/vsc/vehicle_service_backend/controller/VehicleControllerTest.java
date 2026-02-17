package com.vsc.vehicle_service_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vsc.vehicle_service_backend.dto.VehicleRequest;
import com.vsc.vehicle_service_backend.dto.VehicleResponse;
import com.vsc.vehicle_service_backend.service.VehicleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VehicleController.class)
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private VehicleService vehicleService;

    private VehicleResponse vehicleResponse1;
    private VehicleResponse vehicleResponse2;
    private VehicleRequest vehicleRequest;

    @BeforeEach
    void setUp() {
        // Setup response DTOs
        vehicleResponse1 = new VehicleResponse();
        vehicleResponse1.setId(1L);
        vehicleResponse1.setVehicleId("vh_1");
        vehicleResponse1.setVehicleNumber("ABC-1234");
        vehicleResponse1.setBrand("Toyota");
        vehicleResponse1.setModel("Camry");
        vehicleResponse1.setVehicleType("Car");
        vehicleResponse1.setCustomerId(1L);
        vehicleResponse1.setCustomerName("John Doe");

        vehicleResponse2 = new VehicleResponse();
        vehicleResponse2.setId(2L);
        vehicleResponse2.setVehicleId("vh_2");
        vehicleResponse2.setVehicleNumber("XYZ-5678");
        vehicleResponse2.setBrand("Honda");
        vehicleResponse2.setModel("CBR");
        vehicleResponse2.setVehicleType("Bike");
        vehicleResponse2.setCustomerId(2L);
        vehicleResponse2.setCustomerName("Jane Smith");

        // Setup request DTO
        vehicleRequest = new VehicleRequest();
        vehicleRequest.setVehicleNumber("NEW-9999");
        vehicleRequest.setBrand("Tesla");
        vehicleRequest.setModel("Model 3");
        vehicleRequest.setVehicleType("Car");
        vehicleRequest.setCustomerId(1L);
    }

    @Test
    void addVehicle_WithValidRequest_ShouldReturnCreatedVehicle() throws Exception {
        // Arrange
        VehicleResponse newResponse = new VehicleResponse();
        newResponse.setId(3L);
        newResponse.setVehicleId("vh_3");
        newResponse.setVehicleNumber("NEW-9999");
        newResponse.setBrand("Tesla");
        newResponse.setModel("Model 3");
        newResponse.setVehicleType("Car");
        newResponse.setCustomerId(1L);
        newResponse.setCustomerName("John Doe");

        when(vehicleService.addVehicle(any(VehicleRequest.class))).thenReturn(newResponse);

        // Act & Assert
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vehicleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.vehicleId", is("vh_3")))
                .andExpect(jsonPath("$.vehicleNumber", is("NEW-9999")))
                .andExpect(jsonPath("$.brand", is("Tesla")))
                .andExpect(jsonPath("$.model", is("Model 3")))
                .andExpect(jsonPath("$.vehicleType", is("Car")))
                .andExpect(jsonPath("$.customerId", is(1)))
                .andExpect(jsonPath("$.customerName", is("John Doe")));

        verify(vehicleService, times(1)).addVehicle(any(VehicleRequest.class));
    }

    @Test
    void addVehicle_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
        // Arrange - Create invalid request (empty object)
        VehicleRequest invalidRequest = new VehicleRequest();

        // Act & Assert
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());  // Changed back to 400

        verify(vehicleService, never()).addVehicle(any(VehicleRequest.class));
    }

    @Test
    void addVehicle_WithNullCustomerId_ShouldReturnBadRequest() throws Exception {
        // Arrange
        VehicleRequest invalidRequest = new VehicleRequest();
        invalidRequest.setVehicleNumber("NEW-9999");
        invalidRequest.setBrand("Tesla");
        invalidRequest.setModel("Model 3");
        invalidRequest.setVehicleType("Car");
        // customerId is null by default

        // Act & Assert
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());  // Changed back to 400

        verify(vehicleService, never()).addVehicle(any(VehicleRequest.class));
    }

    @Test
    void addVehicle_WithBlankVehicleNumber_ShouldReturnBadRequest() throws Exception {
        // Arrange
        VehicleRequest invalidRequest = new VehicleRequest();
        invalidRequest.setVehicleNumber(""); // Blank vehicle number
        invalidRequest.setBrand("Tesla");
        invalidRequest.setModel("Model 3");
        invalidRequest.setVehicleType("Car");
        invalidRequest.setCustomerId(1L);

        // Act & Assert
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());  // Changed back to 400

        verify(vehicleService, never()).addVehicle(any(VehicleRequest.class));
    }

    @Test
    void addVehicle_WithMissingBrand_ShouldReturnBadRequest() throws Exception {
        // Arrange
        VehicleRequest invalidRequest = new VehicleRequest();
        invalidRequest.setVehicleNumber("NEW-9999");
        invalidRequest.setBrand(""); // Missing brand
        invalidRequest.setModel("Model 3");
        invalidRequest.setVehicleType("Car");
        invalidRequest.setCustomerId(1L);

        // Act & Assert
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());  // Changed back to 400

        verify(vehicleService, never()).addVehicle(any(VehicleRequest.class));
    }

    @Test
    void addVehicle_WithMissingModel_ShouldReturnBadRequest() throws Exception {
        // Arrange
        VehicleRequest invalidRequest = new VehicleRequest();
        invalidRequest.setVehicleNumber("NEW-9999");
        invalidRequest.setBrand("Tesla");
        invalidRequest.setModel(""); // Missing model
        invalidRequest.setVehicleType("Car");
        invalidRequest.setCustomerId(1L);

        // Act & Assert
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());  // Changed back to 400

        verify(vehicleService, never()).addVehicle(any(VehicleRequest.class));
    }

    @Test
    void addVehicle_WithMissingVehicleType_ShouldReturnBadRequest() throws Exception {
        // Arrange
        VehicleRequest invalidRequest = new VehicleRequest();
        invalidRequest.setVehicleNumber("NEW-9999");
        invalidRequest.setBrand("Tesla");
        invalidRequest.setModel("Model 3");
        invalidRequest.setVehicleType(""); // Missing vehicle type
        invalidRequest.setCustomerId(1L);

        // Act & Assert
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());  // Changed back to 400

        verify(vehicleService, never()).addVehicle(any(VehicleRequest.class));
    }

    @Test
    void getAll_ShouldReturnListOfVehicles() throws Exception {
        // Arrange
        List<VehicleResponse> vehicles = Arrays.asList(vehicleResponse1, vehicleResponse2);
        when(vehicleService.getAllVehicles()).thenReturn(vehicles);

        // Act & Assert
        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].vehicleId", is("vh_1")))
                .andExpect(jsonPath("$[0].vehicleNumber", is("ABC-1234")))
                .andExpect(jsonPath("$[0].brand", is("Toyota")))
                .andExpect(jsonPath("$[0].model", is("Camry")))
                .andExpect(jsonPath("$[0].vehicleType", is("Car")))
                .andExpect(jsonPath("$[0].customerId", is(1)))
                .andExpect(jsonPath("$[0].customerName", is("John Doe")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].vehicleId", is("vh_2")))
                .andExpect(jsonPath("$[1].vehicleNumber", is("XYZ-5678")))
                .andExpect(jsonPath("$[1].brand", is("Honda")))
                .andExpect(jsonPath("$[1].model", is("CBR")))
                .andExpect(jsonPath("$[1].vehicleType", is("Bike")))
                .andExpect(jsonPath("$[1].customerId", is(2)))
                .andExpect(jsonPath("$[1].customerName", is("Jane Smith")));

        verify(vehicleService, times(1)).getAllVehicles();
    }

    @Test
    void getAll_WhenNoVehicles_ShouldReturnEmptyList() throws Exception {
        // Arrange
        when(vehicleService.getAllVehicles()).thenReturn(Arrays.asList());

        // Act & Assert
        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(vehicleService, times(1)).getAllVehicles();
    }

    @Test
    void getById_WithValidId_ShouldReturnVehicle() throws Exception {
        // Arrange
        when(vehicleService.getVehicleById(1L)).thenReturn(vehicleResponse1);

        // Act & Assert
        mockMvc.perform(get("/api/vehicles/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.vehicleId", is("vh_1")))
                .andExpect(jsonPath("$.vehicleNumber", is("ABC-1234")))
                .andExpect(jsonPath("$.brand", is("Toyota")))
                .andExpect(jsonPath("$.model", is("Camry")))
                .andExpect(jsonPath("$.vehicleType", is("Car")))
                .andExpect(jsonPath("$.customerId", is(1)))
                .andExpect(jsonPath("$.customerName", is("John Doe")));

        verify(vehicleService, times(1)).getVehicleById(1L);
    }

    @Test
    void getById_WithInvalidId_ShouldReturnError() throws Exception {
        // Arrange
        when(vehicleService.getVehicleById(99L)).thenThrow(new RuntimeException("Vehicle not found with id: 99"));

        // Act & Assert
        mockMvc.perform(get("/api/vehicles/99"))
                .andExpect(status().isInternalServerError());

        verify(vehicleService, times(1)).getVehicleById(99L);
    }

    @Test
    void update_WithValidData_ShouldReturnUpdatedVehicle() throws Exception {
        // Arrange
        VehicleRequest updateRequest = new VehicleRequest();
        updateRequest.setVehicleNumber("UPD-1234");
        updateRequest.setBrand("Updated Brand");
        updateRequest.setModel("Updated Model");
        updateRequest.setVehicleType("Truck");
        updateRequest.setCustomerId(2L);

        VehicleResponse updatedResponse = new VehicleResponse();
        updatedResponse.setId(1L);
        updatedResponse.setVehicleId("vh_1");
        updatedResponse.setVehicleNumber("UPD-1234");
        updatedResponse.setBrand("Updated Brand");
        updatedResponse.setModel("Updated Model");
        updatedResponse.setVehicleType("Truck");
        updatedResponse.setCustomerId(2L);
        updatedResponse.setCustomerName("Jane Smith");

        when(vehicleService.updateVehicle(eq(1L), any(VehicleRequest.class))).thenReturn(updatedResponse);

        // Act & Assert
        mockMvc.perform(put("/api/vehicles/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.vehicleId", is("vh_1")))
                .andExpect(jsonPath("$.vehicleNumber", is("UPD-1234")))
                .andExpect(jsonPath("$.brand", is("Updated Brand")))
                .andExpect(jsonPath("$.model", is("Updated Model")))
                .andExpect(jsonPath("$.vehicleType", is("Truck")))
                .andExpect(jsonPath("$.customerId", is(2)))
                .andExpect(jsonPath("$.customerName", is("Jane Smith")));

        verify(vehicleService, times(1)).updateVehicle(eq(1L), any(VehicleRequest.class));
    }

    @Test
    void update_WithInvalidVehicleId_ShouldReturnError() throws Exception {
        // Arrange
        when(vehicleService.updateVehicle(eq(99L), any(VehicleRequest.class)))
                .thenThrow(new RuntimeException("Vehicle not found with id: 99"));

        // Act & Assert
        mockMvc.perform(put("/api/vehicles/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vehicleRequest)))
                .andExpect(status().isInternalServerError());

        verify(vehicleService, times(1)).updateVehicle(eq(99L), any(VehicleRequest.class));
    }

    @Test
    void update_WithInvalidCustomerId_ShouldReturnError() throws Exception {
        // Arrange
        when(vehicleService.updateVehicle(eq(1L), any(VehicleRequest.class)))
                .thenThrow(new RuntimeException("Customer not found with id: 99"));

        // Act & Assert
        mockMvc.perform(put("/api/vehicles/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vehicleRequest)))
                .andExpect(status().isInternalServerError());

        verify(vehicleService, times(1)).updateVehicle(eq(1L), any(VehicleRequest.class));
    }

    @Test
    void update_WithInvalidRequestData_ShouldReturnBadRequest() throws Exception {
        // Arrange - Create invalid update request
        VehicleRequest invalidRequest = new VehicleRequest();
        invalidRequest.setVehicleNumber(""); // Blank vehicle number
        invalidRequest.setBrand("Updated Brand");
        invalidRequest.setModel("Updated Model");
        invalidRequest.setVehicleType("Truck");
        invalidRequest.setCustomerId(2L);

        // Act & Assert
        mockMvc.perform(put("/api/vehicles/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());  // Changed back to 400

        verify(vehicleService, never()).updateVehicle(anyLong(), any(VehicleRequest.class));
    }

    @Test
    void update_WithMissingBrand_ShouldReturnBadRequest() throws Exception {
        // Arrange
        VehicleRequest invalidRequest = new VehicleRequest();
        invalidRequest.setVehicleNumber("UPD-1234");
        invalidRequest.setBrand(""); // Missing brand
        invalidRequest.setModel("Updated Model");
        invalidRequest.setVehicleType("Truck");
        invalidRequest.setCustomerId(2L);

        // Act & Assert
        mockMvc.perform(put("/api/vehicles/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());  // Changed back to 400

        verify(vehicleService, never()).updateVehicle(anyLong(), any(VehicleRequest.class));
    }

    @Test
    void delete_WithValidId_ShouldReturnSuccessMessage() throws Exception {
        // Arrange
        doNothing().when(vehicleService).deleteVehicle(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/vehicles/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Vehicle Deleted"));

        verify(vehicleService, times(1)).deleteVehicle(1L);
    }

    @Test
    void delete_WithAnyId_ShouldNotThrowError() throws Exception {
        // Arrange
        doNothing().when(vehicleService).deleteVehicle(99L);

        // Act & Assert
        mockMvc.perform(delete("/api/vehicles/99"))
                .andExpect(status().isOk())
                .andExpect(content().string("Vehicle Deleted"));

        verify(vehicleService, times(1)).deleteVehicle(99L);
    }

    @Test
    void delete_WhenServiceThrowsException_ShouldReturnError() throws Exception {
        // Arrange
        doThrow(new RuntimeException("Database error")).when(vehicleService).deleteVehicle(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/vehicles/1"))
                .andExpect(status().isInternalServerError());

        verify(vehicleService, times(1)).deleteVehicle(1L);
    }

    @Test
    void cors_ShouldAllowOrigins() throws Exception {
        // Test CORS configuration
        mockMvc.perform(options("/api/vehicles")
                        .header("Origin", "http://localhost:3000")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }
}