package com.vsc.vehicle_service_backend.service;



import com.vsc.vehicle_service_backend.entity.Customer;
import java.util.List;

public interface CustomerService {

    Customer addCustomer(Customer customer);

    Customer updateCustomer(Long id, Customer customer);

    void deleteCustomer(Long id);

    Customer getCustomerById(Long id);

    List<Customer> getAllCustomers();
}

