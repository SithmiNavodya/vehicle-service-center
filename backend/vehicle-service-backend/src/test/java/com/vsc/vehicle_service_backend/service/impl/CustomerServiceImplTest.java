package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.entity.Customer;
import com.vsc.vehicle_service_backend.repository.CustomerRepository;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceImplTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerServiceImpl customerService;

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
    void addCustomer_WithValidData_ShouldCreateCustomer() {
        // Arrange
        when(customerRepository.existsByEmail("bob@example.com")).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> {
            Customer saved = invocation.getArgument(0);
            saved.setId(3L);
            return saved;
        });

        // Act
        Customer result = customerService.addCustomer(newCustomer);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(3L);
        assertThat(result.getName()).isEqualTo("Bob Wilson");
        assertThat(result.getEmail()).isEqualTo("bob@example.com");
        assertThat(result.getPhone()).isEqualTo("5555555555");
        assertThat(result.getAddress()).isEqualTo("789 Pine St");

        verify(customerRepository, times(1)).existsByEmail("bob@example.com");
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void addCustomer_WithDuplicateEmail_ShouldThrowException() {
        // Arrange
        when(customerRepository.existsByEmail("john@example.com")).thenReturn(true);

        Customer duplicateCustomer = new Customer();
        duplicateCustomer.setName("John Clone");
        duplicateCustomer.setEmail("john@example.com"); // Same email as existing
        duplicateCustomer.setPhone("1111111111");
        duplicateCustomer.setAddress("Clone Address");

        // Act & Assert
        assertThatThrownBy(() -> customerService.addCustomer(duplicateCustomer))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email already exists!");

        verify(customerRepository, times(1)).existsByEmail("john@example.com");
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    void getCustomerById_WithValidId_ShouldReturnCustomer() {
        // Arrange
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer1));

        // Act
        Customer result = customerService.getCustomerById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("John Doe");
        assertThat(result.getEmail()).isEqualTo("john@example.com");
        assertThat(result.getPhone()).isEqualTo("1234567890");
        assertThat(result.getAddress()).isEqualTo("123 Main St");

        verify(customerRepository, times(1)).findById(1L);
    }

    @Test
    void getCustomerById_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> customerService.getCustomerById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Customer not found");

        verify(customerRepository, times(1)).findById(99L);
    }

    @Test
    void getAllCustomers_ShouldReturnListOfCustomers() {
        // Arrange
        when(customerRepository.findAll()).thenReturn(Arrays.asList(customer1, customer2));

        // Act
        List<Customer> result = customerService.getAllCustomers();

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("John Doe");
        assertThat(result.get(0).getEmail()).isEqualTo("john@example.com");
        assertThat(result.get(1).getName()).isEqualTo("Jane Smith");
        assertThat(result.get(1).getEmail()).isEqualTo("jane@example.com");

        verify(customerRepository, times(1)).findAll();
    }

    @Test
    void getAllCustomers_WhenNoCustomers_ShouldReturnEmptyList() {
        // Arrange
        when(customerRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<Customer> result = customerService.getAllCustomers();

        // Assert
        assertThat(result).isEmpty();
        verify(customerRepository, times(1)).findAll();
    }

    @Test
    void updateCustomer_WithValidData_ShouldUpdateCustomer() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setName("John Updated");
        updateData.setEmail("john.updated@example.com");
        updateData.setPhone("9999999999");
        updateData.setAddress("Updated Address");

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer1));
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Customer result = customerService.updateCustomer(1L, updateData);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("John Updated");
        assertThat(result.getEmail()).isEqualTo("john.updated@example.com");
        assertThat(result.getPhone()).isEqualTo("9999999999");
        assertThat(result.getAddress()).isEqualTo("Updated Address");

        verify(customerRepository, times(1)).findById(1L);
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void updateCustomer_WithValidDataAndSameEmail_ShouldUpdateSuccessfully() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setName("John Updated");
        updateData.setEmail("john@example.com"); // Same email as existing
        updateData.setPhone("9999999999");
        updateData.setAddress("Updated Address");

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer1));
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Customer result = customerService.updateCustomer(1L, updateData);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("John Updated");
        assertThat(result.getEmail()).isEqualTo("john@example.com"); // Should keep same email

        verify(customerRepository, times(1)).findById(1L);
        verify(customerRepository, never()).existsByEmail(anyString()); // Should not check existence for same email
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void updateCustomer_WithDuplicateEmail_ShouldThrowException() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setName("John Updated");
        updateData.setEmail("jane@example.com"); // Email that belongs to customer2
        updateData.setPhone("9999999999");
        updateData.setAddress("Updated Address");

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer1));
        when(customerRepository.existsByEmail("jane@example.com")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> customerService.updateCustomer(1L, updateData))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email already exists!");

        verify(customerRepository, times(1)).findById(1L);
        verify(customerRepository, times(1)).existsByEmail("jane@example.com");
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    void updateCustomer_WithInvalidId_ShouldThrowException() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setName("Test Name");

        when(customerRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> customerService.updateCustomer(99L, updateData))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Customer not found");

        verify(customerRepository, times(1)).findById(99L);
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    void updateCustomer_WithPartialData_ShouldUpdateOnlyProvidedFields() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setName("Only Name Updated");
        // Email, phone, address are null - should keep existing values

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer1));
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Customer result = customerService.updateCustomer(1L, updateData);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Only Name Updated");
        assertThat(result.getEmail()).isEqualTo("john@example.com"); // Kept existing
        assertThat(result.getPhone()).isEqualTo("1234567890"); // Kept existing
        assertThat(result.getAddress()).isEqualTo("123 Main St"); // Kept existing

        verify(customerRepository, times(1)).findById(1L);
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void updateCustomer_WithOnlyEmailUpdate_ShouldUpdateEmail() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setEmail("new.email@example.com");
        // Name, phone, address are null - should keep existing values

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer1));
        when(customerRepository.existsByEmail("new.email@example.com")).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Customer result = customerService.updateCustomer(1L, updateData);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("John Doe"); // Kept existing
        assertThat(result.getEmail()).isEqualTo("new.email@example.com"); // Updated
        assertThat(result.getPhone()).isEqualTo("1234567890"); // Kept existing
        assertThat(result.getAddress()).isEqualTo("123 Main St"); // Kept existing

        verify(customerRepository, times(1)).findById(1L);
        verify(customerRepository, times(1)).existsByEmail("new.email@example.com");
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void updateCustomer_WithOnlyPhoneUpdate_ShouldUpdatePhone() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setPhone("7777777777");
        // Name, email, address are null - should keep existing values

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer1));
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Customer result = customerService.updateCustomer(1L, updateData);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("John Doe"); // Kept existing
        assertThat(result.getEmail()).isEqualTo("john@example.com"); // Kept existing
        assertThat(result.getPhone()).isEqualTo("7777777777"); // Updated
        assertThat(result.getAddress()).isEqualTo("123 Main St"); // Kept existing

        verify(customerRepository, times(1)).findById(1L);
        verify(customerRepository, never()).existsByEmail(anyString());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void updateCustomer_WithOnlyAddressUpdate_ShouldUpdateAddress() {
        // Arrange
        Customer updateData = new Customer();
        updateData.setAddress("New Address");
        // Name, email, phone are null - should keep existing values

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer1));
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Customer result = customerService.updateCustomer(1L, updateData);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("John Doe"); // Kept existing
        assertThat(result.getEmail()).isEqualTo("john@example.com"); // Kept existing
        assertThat(result.getPhone()).isEqualTo("1234567890"); // Kept existing
        assertThat(result.getAddress()).isEqualTo("New Address"); // Updated

        verify(customerRepository, times(1)).findById(1L);
        verify(customerRepository, never()).existsByEmail(anyString());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void deleteCustomer_WithValidId_ShouldDeleteCustomer() {
        // Arrange
        doNothing().when(customerRepository).deleteById(1L);

        // Act
        customerService.deleteCustomer(1L);

        // Assert
        verify(customerRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteCustomer_WithAnyId_ShouldNotThrowException() {
        // Note: deleteById doesn't throw exception even if ID doesn't exist
        // Arrange
        doNothing().when(customerRepository).deleteById(99L);

        // Act
        customerService.deleteCustomer(99L);

        // Assert
        verify(customerRepository, times(1)).deleteById(99L);
    }

    @Test
    void existsByEmail_ShouldReturnTrue_WhenEmailExists() {
        // Arrange
        when(customerRepository.existsByEmail("john@example.com")).thenReturn(true);

        // We can test this through addCustomer method
        Customer duplicateCustomer = new Customer();
        duplicateCustomer.setEmail("john@example.com");

        // Act & Assert
        assertThatThrownBy(() -> customerService.addCustomer(duplicateCustomer))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email already exists!");

        verify(customerRepository, times(1)).existsByEmail("john@example.com");
    }
}