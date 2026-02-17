package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.dto.VehicleRequest;
import com.vsc.vehicle_service_backend.dto.VehicleResponse;
import com.vsc.vehicle_service_backend.entity.Customer;
import com.vsc.vehicle_service_backend.entity.Vehicle;
import com.vsc.vehicle_service_backend.repository.CustomerRepository;
import com.vsc.vehicle_service_backend.repository.VehicleRepository;
import com.vsc.vehicle_service_backend.service.VehicleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository repository;
    private final CustomerRepository customerRepository;

    private String generateVehicleId() {
        String lastId = repository.getLastVehicleId();
        if (lastId == null) return "vh_1";

        try {
            int num = Integer.parseInt(lastId.split("_")[1]);
            return "vh_" + (num + 1);
        } catch (Exception e) {
            return "vh_" + (repository.count() + 1);
        }
    }

    @Override
    public VehicleResponse addVehicle(VehicleRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + request.getCustomerId()));

        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleId(generateVehicleId());
        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setCustomer(customer);

        Vehicle savedVehicle = repository.save(vehicle);
        return convertToResponse(savedVehicle);
    }

    @Override
    public List<VehicleResponse> getAllVehicles() {
        return repository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        return convertToResponse(vehicle);
    }

    @Override
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        log.info("[VehicleService] Updating vehicle with id: {} to customerId: {}", id, request.getCustomerId());
        
        Vehicle vehicle = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + request.getCustomerId()));

        log.info("[VehicleService] Found vehicle: {} and customer: {}", vehicle.getVehicleNumber(), customer.getName());

        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setCustomer(customer);

        Vehicle updatedVehicle = repository.save(vehicle);
        log.info("[VehicleService] Save completed. Updated vehicle customer name: {}", 
                updatedVehicle.getCustomer() != null ? updatedVehicle.getCustomer().getName() : "NULL");
        
        return convertToResponse(updatedVehicle);
    }

    @Override
    public void deleteVehicle(Long id) {
        repository.deleteById(id);
    }

    private VehicleResponse convertToResponse(Vehicle vehicle) {
        VehicleResponse response = new VehicleResponse();
        response.setId(vehicle.getId());
        response.setVehicleId(vehicle.getVehicleId());
        response.setVehicleNumber(vehicle.getVehicleNumber());
        response.setBrand(vehicle.getBrand());
        response.setModel(vehicle.getModel());
        response.setVehicleType(vehicle.getVehicleType());
        if (vehicle.getCustomer() != null) {
            response.setCustomerId(vehicle.getCustomer().getId());
            response.setCustomerName(vehicle.getCustomer().getName());
        }
        return response;
    }
}
