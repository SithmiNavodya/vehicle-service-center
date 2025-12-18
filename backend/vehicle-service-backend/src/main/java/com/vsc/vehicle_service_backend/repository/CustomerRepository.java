package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    boolean existsByEmail(String email);

}
