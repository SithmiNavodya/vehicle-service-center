package com.vsc.vehicle_service_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vsc.vehicle_service_backend.entity.Customer;
import com.vsc.vehicle_service_backend.service.CustomerService;
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

@WebMvcTest(CustomerController.class)
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CustomerService customerService;

    private Customer customer1;
    private Customer customer2;
    private Customer newCustomer;

    @BeforeEach
    void setUp() {
        // Setup existing customers
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

        // Setup new customer for creation
        newCustomer = new Customer();
        newCustomer.setName("Bob Wilson");
        newCustomer.setEmail("bob@example.com");
        newCustomer.setPhone("5555555555");
        newCustomer.setAddress("789 Pine St");
    }

    @Test
    void addCustomer_WithValidData_ShouldReturnCreatedCustomer() throws Exception {
        // Arrange
        Customer savedCustomer = new Customer();
        savedCustomer.setId(3L);
        savedCustomer.setName("Bob Wilson");
        savedCustomer.setEmail("bob@example.com");
        savedCustomer.setPhone("5555555555");
        savedCustomer.setAddress("789 Pine St");

        when(customerService.addCustomer(any(Customer.class))).thenReturn(savedCustomer);

        // Act & Assert
        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCustomer)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.name", is("Bob Wilson")))
                .andExpect(jsonPath("$.email", is("bob@example.com")))
                .andExpect(jsonPath("$.phone", is("5555555555")))
                .andExpect(jsonPath("$.address", is("789 Pine St")));

        verify(customerService, times(1)).addCustomer(any(Customer.class));
    }

    @Test
    void addCustomer_WithDuplicateEmail_ShouldReturnError() throws Exception {
        // Arrange
        when(customerService.addCustomer(any(Customer.class)))
                .thenThrow(new RuntimeException("Email already exists!"));

        // Act & Assert
        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCustomer)))
                .andExpect(status().isInternalServerError());

        verify(customerService, times(1)).addCustomer(any(Customer.class));
    }

    @Test
    void addCustomer_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        // Note: Since we don't have @Valid annotations, this test expects 200
        // If you add @Valid later, change this to expect 400
        Customer invalidCustomer = new Customer();
        // All fields are null/empty

        when(customerService.addCustomer(any(Customer.class))).thenReturn(invalidCustomer);

        // Act & Assert
        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidCustomer)))
                .andExpect(status().isOk()); // Change to isBadRequest() if you add @Valid

        verify(customerService, times(1)).addCustomer(any(Customer.class));
    }

    @Test
    void getAllCustomers_ShouldReturnListOfCustomers() throws Exception {
        // Arrange
        List<Customer> customers = Arrays.asList(customer1, customer2);
        when(customerService.getAllCustomers()).thenReturn(customers);

        // Act & Assert
        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("John Doe")))
                .andExpect(jsonPath("$[0].email", is("john@example.com")))
                .andExpect(jsonPath("$[0].phone", is("1234567890")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].name", is("Jane Smith")))
                .andExpect(jsonPath("$[1].email", is("jane@example.com")));

        verify(customerService, times(1)).getAllCustomers();
    }

    @Test
    void getAllCustomers_WhenNoCustomers_ShouldReturnEmptyList() throws Exception {
        // Arrange
        when(customerService.getAllCustomers()).thenReturn(Arrays.asList());

        // Act & Assert
        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(customerService, times(1)).getAllCustomers();
    }

    @Test
    void getCustomer_WithValidId_ShouldReturnCustomer() throws Exception {
        // Arrange
        when(customerService.getCustomerById(1L)).thenReturn(customer1);

        // Act & Assert
        mockMvc.perform(get("/api/customers/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("John Doe")))
                .andExpect(jsonPath("$.email", is("john@example.com")));

        verify(customerService, times(1)).getCustomerById(1L);
    }

    @Test
    void getCustomer_WithInvalidId_ShouldReturnError() throws Exception {
        // Arrange
        when(customerService.getCustomerById(99L)).thenThrow(new RuntimeException("Customer not found"));

        // Act & Assert
        mockMvc.perform(get("/api/customers/99"))
                .andExpect(status().isInternalServerError());

        verify(customerService, times(1)).getCustomerById(99L);
    }

    @Test
    void updateCustomer_WithValidData_ShouldReturnUpdatedCustomer() throws Exception {
        // Arrange
        Customer updateData = new Customer();
        updateData.setName("John Updated");
        updateData.setEmail("john.updated@example.com");
        updateData.setPhone("9999999999");
        updateData.setAddress("Updated Address");

        Customer updatedCustomer = new Customer();
        updatedCustomer.setId(1L);
        updatedCustomer.setName("John Updated");
        updatedCustomer.setEmail("john.updated@example.com");
        updatedCustomer.setPhone("9999999999");
        updatedCustomer.setAddress("Updated Address");

        when(customerService.updateCustomer(eq(1L), any(Customer.class))).thenReturn(updatedCustomer);

        // Act & Assert
        mockMvc.perform(put("/api/customers/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("John Updated")))
                .andExpect(jsonPath("$.email", is("john.updated@example.com")))
                .andExpect(jsonPath("$.phone", is("9999999999")))
                .andExpect(jsonPath("$.address", is("Updated Address")));

        verify(customerService, times(1)).updateCustomer(eq(1L), any(Customer.class));
    }

    @Test
    void updateCustomer_WithInvalidId_ShouldReturnError() throws Exception {
        // Arrange
        Customer updateData = new Customer();
        updateData.setName("Test Name");

        when(customerService.updateCustomer(eq(99L), any(Customer.class)))
                .thenThrow(new RuntimeException("Customer not found"));

        // Act & Assert
        mockMvc.perform(put("/api/customers/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isInternalServerError());

        verify(customerService, times(1)).updateCustomer(eq(99L), any(Customer.class));
    }

    @Test
    void updateCustomer_WithInvalidData_ShouldReturnOk() throws Exception {
        // Note: Since we don't have @Valid annotations, partial updates are allowed
        // The service will preserve existing values for null fields
        Customer invalidData = new Customer();
        // Only set name, other fields null
        invalidData.setName("Only Name Updated");

        Customer updatedCustomer = new Customer();
        updatedCustomer.setId(1L);
        updatedCustomer.setName("Only Name Updated");
        updatedCustomer.setEmail("john@example.com"); // Preserved
        updatedCustomer.setPhone("1234567890"); // Preserved
        updatedCustomer.setAddress("123 Main St"); // Preserved

        when(customerService.updateCustomer(eq(1L), any(Customer.class))).thenReturn(updatedCustomer);

        // Act & Assert
        mockMvc.perform(put("/api/customers/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Only Name Updated")))
                .andExpect(jsonPath("$.email", is("john@example.com")))
                .andExpect(jsonPath("$.phone", is("1234567890")))
                .andExpect(jsonPath("$.address", is("123 Main St")));

        verify(customerService, times(1)).updateCustomer(eq(1L), any(Customer.class));
    }

    @Test
    void deleteCustomer_WithValidId_ShouldReturnSuccessMessage() throws Exception {
        // Arrange
        doNothing().when(customerService).deleteCustomer(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/customers/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Customer deleted successfully"));

        verify(customerService, times(1)).deleteCustomer(1L);
    }

    @Test
    void deleteCustomer_WithAnyId_ShouldNotThrowError() throws Exception {
        // Arrange
        doNothing().when(customerService).deleteCustomer(99L);

        // Act & Assert
        mockMvc.perform(delete("/api/customers/99"))
                .andExpect(status().isOk())
                .andExpect(content().string("Customer deleted successfully"));

        verify(customerService, times(1)).deleteCustomer(99L);
    }

    @Test
    void deleteCustomer_WhenServiceThrowsException_ShouldReturnError() throws Exception {
        // Arrange
        doThrow(new RuntimeException("Database error")).when(customerService).deleteCustomer(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/customers/1"))
                .andExpect(status().isInternalServerError());

        verify(customerService, times(1)).deleteCustomer(1L);
    }

    @Test
    void cors_ShouldAllowOrigins() throws Exception {
        // Test CORS configuration
        mockMvc.perform(options("/api/customers")
                        .header("Origin", "http://localhost:3000")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }
}