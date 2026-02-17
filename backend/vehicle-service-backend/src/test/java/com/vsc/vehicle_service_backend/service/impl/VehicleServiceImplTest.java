package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.dto.VehicleRequest;
import com.vsc.vehicle_service_backend.dto.VehicleResponse;
import com.vsc.vehicle_service_backend.entity.Customer;
import com.vsc.vehicle_service_backend.entity.Vehicle;
import com.vsc.vehicle_service_backend.repository.CustomerRepository;
import com.vsc.vehicle_service_backend.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceImplTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private VehicleServiceImpl vehicleService;

    private Customer customer1;
    private Customer customer2;
    private Vehicle vehicle1;
    private Vehicle vehicle2;
    private VehicleRequest vehicleRequest;

    @BeforeEach
    void setUp() {
        // Setup Customers
        customer1 = new Customer();
        customer1.setId(1L);
        customer1.setName("John Doe");
        customer1.setEmail("john@example.com");
        customer1.setPhone("1234567890");
        customer1.setAddress("123 Main St");

        customer2 = new Customer();
        customer2.setId(2L);
        customer2.setName("Jane Smith");
        customer2.setEmail("jane@example.com");
        customer2.setPhone("0987654321");
        customer2.setAddress("456 Oak Ave");

        // Setup Vehicles
        vehicle1 = new Vehicle();
        vehicle1.setVehicleId("vh_1");
        vehicle1.setVehicleNumber("ABC-1234");
        vehicle1.setBrand("Toyota");
        vehicle1.setModel("Camry");
        vehicle1.setVehicleType("Car");
        vehicle1.setCustomer(customer1);

        vehicle2 = new Vehicle();
        vehicle2.setVehicleId("vh_2");
        vehicle2.setVehicleNumber("XYZ-5678");
        vehicle2.setBrand("Honda");
        vehicle2.setModel("CBR");
        vehicle2.setVehicleType("Bike");
        vehicle2.setCustomer(customer2);

        // Setup VehicleRequest
        vehicleRequest = new VehicleRequest();
        vehicleRequest.setVehicleNumber("NEW-9999");
        vehicleRequest.setBrand("Tesla");
        vehicleRequest.setModel("Model 3");
        vehicleRequest.setVehicleType("Car");
        vehicleRequest.setCustomerId(1L);
    }

    @Test
    void addVehicle_WithValidData_ShouldCreateVehicle() {
        // Arrange
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer1));
        when(vehicleRepository.getLastVehicleId()).thenReturn("vh_5");
        when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        VehicleResponse response = vehicleService.addVehicle(vehicleRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getVehicleId()).isEqualTo("vh_6");
        assertThat(response.getVehicleNumber()).isEqualTo("NEW-9999");
        assertThat(response.getBrand()).isEqualTo("Tesla");
        assertThat(response.getModel()).isEqualTo("Model 3");
        assertThat(response.getVehicleType()).isEqualTo("Car");
        assertThat(response.getCustomerId()).isEqualTo(1L);
        assertThat(response.getCustomerName()).isEqualTo("John Doe");

        verify(customerRepository, times(1)).findById(1L);
        verify(vehicleRepository, times(1)).getLastVehicleId();
        verify(vehicleRepository, times(1)).save(any(Vehicle.class));
    }

    @Test
    void addVehicle_WithInvalidCustomerId_ShouldThrowException() {
        // Arrange
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());
        vehicleRequest.setCustomerId(99L);

        // Act & Assert
        assertThatThrownBy(() -> vehicleService.addVehicle(vehicleRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Customer not found with id: 99");

        verify(customerRepository, times(1)).findById(99L);
        verify(vehicleRepository, never()).save(any(Vehicle.class));
    }

    @Test
    void addVehicle_WithNoLastId_ShouldGenerateFirstId() {
        // Arrange
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer1));
        when(vehicleRepository.getLastVehicleId()).thenReturn(null);
        // Remove the count() stub since it might not be needed
        when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        VehicleResponse response = vehicleService.addVehicle(vehicleRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getVehicleId()).isEqualTo("vh_1");

        verify(vehicleRepository, times(1)).getLastVehicleId();
        verify(vehicleRepository, times(1)).save(any(Vehicle.class));
    }

    @Test
    void getAllVehicles_ShouldReturnListOfVehicles() {
        // Arrange
        when(vehicleRepository.findAll()).thenReturn(Arrays.asList(vehicle1, vehicle2));

        // Act
        List<VehicleResponse> responses = vehicleService.getAllVehicles();

        // Assert
        assertThat(responses).hasSize(2);

        assertThat(responses.get(0).getVehicleId()).isEqualTo("vh_1");
        assertThat(responses.get(0).getVehicleNumber()).isEqualTo("ABC-1234");
        assertThat(responses.get(0).getCustomerName()).isEqualTo("John Doe");

        assertThat(responses.get(1).getVehicleId()).isEqualTo("vh_2");
        assertThat(responses.get(1).getVehicleNumber()).isEqualTo("XYZ-5678");
        assertThat(responses.get(1).getCustomerName()).isEqualTo("Jane Smith");

        verify(vehicleRepository, times(1)).findAll();
    }

    @Test
    void getVehicleById_WithValidId_ShouldReturnVehicle() {
        // Arrange
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle1));

        // Act
        VehicleResponse response = vehicleService.getVehicleById(1L);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getVehicleId()).isEqualTo("vh_1");
        assertThat(response.getVehicleNumber()).isEqualTo("ABC-1234");
        assertThat(response.getBrand()).isEqualTo("Toyota");
        assertThat(response.getModel()).isEqualTo("Camry");
        assertThat(response.getVehicleType()).isEqualTo("Car");
        assertThat(response.getCustomerId()).isEqualTo(1L);
        assertThat(response.getCustomerName()).isEqualTo("John Doe");

        verify(vehicleRepository, times(1)).findById(1L);
    }

    @Test
    void getVehicleById_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(vehicleRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> vehicleService.getVehicleById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Vehicle not found with id: 99");

        verify(vehicleRepository, times(1)).findById(99L);
    }

    @Test
    void updateVehicle_WithValidData_ShouldUpdateVehicle() {
        // Arrange
        VehicleRequest updateRequest = new VehicleRequest();
        updateRequest.setVehicleNumber("UPD-1234");
        updateRequest.setBrand("Updated Brand");
        updateRequest.setModel("Updated Model");
        updateRequest.setVehicleType("Truck");
        updateRequest.setCustomerId(2L);

        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle1));
        when(customerRepository.findById(2L)).thenReturn(Optional.of(customer2));
        when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        VehicleResponse response = vehicleService.updateVehicle(1L, updateRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getVehicleId()).isEqualTo("vh_1");
        assertThat(response.getVehicleNumber()).isEqualTo("UPD-1234");
        assertThat(response.getBrand()).isEqualTo("Updated Brand");
        assertThat(response.getModel()).isEqualTo("Updated Model");
        assertThat(response.getVehicleType()).isEqualTo("Truck");
        assertThat(response.getCustomerId()).isEqualTo(2L);
        assertThat(response.getCustomerName()).isEqualTo("Jane Smith");

        verify(vehicleRepository, times(1)).findById(1L);
        verify(customerRepository, times(1)).findById(2L);
        verify(vehicleRepository, times(1)).save(any(Vehicle.class));
    }

    @Test
    void updateVehicle_WithInvalidVehicleId_ShouldThrowException() {
        // Arrange
        when(vehicleRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> vehicleService.updateVehicle(99L, vehicleRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Vehicle not found with id: 99");

        verify(vehicleRepository, times(1)).findById(99L);
        verify(customerRepository, never()).findById(anyLong());
        verify(vehicleRepository, never()).save(any(Vehicle.class));
    }

    @Test
    void updateVehicle_WithInvalidCustomerId_ShouldThrowException() {
        // Arrange
        vehicleRequest.setCustomerId(99L);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle1));
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> vehicleService.updateVehicle(1L, vehicleRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Customer not found with id: 99");

        verify(vehicleRepository, times(1)).findById(1L);
        verify(customerRepository, times(1)).findById(99L);
        verify(vehicleRepository, never()).save(any(Vehicle.class));
    }

    @Test
    void deleteVehicle_WithValidId_ShouldDeleteVehicle() {
        // Arrange
        doNothing().when(vehicleRepository).deleteById(1L);

        // Act
        vehicleService.deleteVehicle(1L);

        // Assert
        verify(vehicleRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteVehicle_WithAnyId_ShouldNotThrowException() {
        // Arrange
        doNothing().when(vehicleRepository).deleteById(99L);

        // Act
        vehicleService.deleteVehicle(99L);

        // Assert
        verify(vehicleRepository, times(1)).deleteById(99L);
    }

    @Test
    void convertToResponse_WithNullCustomer_ShouldHandleGracefully() {
        // Arrange
        Vehicle vehicleWithNoCustomer = new Vehicle();
        vehicleWithNoCustomer.setVehicleId("vh_3");
        vehicleWithNoCustomer.setVehicleNumber("NO-CUST-123");
        vehicleWithNoCustomer.setBrand("Test");
        vehicleWithNoCustomer.setModel("Test Model");
        vehicleWithNoCustomer.setVehicleType("Test");
        vehicleWithNoCustomer.setCustomer(null);

        when(vehicleRepository.findById(3L)).thenReturn(Optional.of(vehicleWithNoCustomer));

        // Act
        VehicleResponse response = vehicleService.getVehicleById(3L);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getVehicleId()).isEqualTo("vh_3");
        assertThat(response.getCustomerId()).isNull();
        assertThat(response.getCustomerName()).isNull();
    }
}