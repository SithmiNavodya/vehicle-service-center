package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.entity.Customer;
import com.vsc.vehicle_service_backend.repository.CustomerRepository;
import com.vsc.vehicle_service_backend.service.CustomerService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public Customer addCustomer(Customer customer) {
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }
        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Only update fields that are provided (not null)
        if (updatedCustomer.getName() != null) {
            existing.setName(updatedCustomer.getName());
        }
        if (updatedCustomer.getEmail() != null) {
            // Check if new email already exists (and it's not the same customer)
            if (!existing.getEmail().equals(updatedCustomer.getEmail()) &&
                    customerRepository.existsByEmail(updatedCustomer.getEmail())) {
                throw new RuntimeException("Email already exists!");
            }
            existing.setEmail(updatedCustomer.getEmail());
        }
        if (updatedCustomer.getPhone() != null) {
            existing.setPhone(updatedCustomer.getPhone());
        }
        if (updatedCustomer.getAddress() != null) {
            existing.setAddress(updatedCustomer.getAddress());
        }

        return customerRepository.save(existing);
    }

    @Override
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
}