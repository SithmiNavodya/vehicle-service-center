package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.dto.SparePartIncomeRequest;
import com.vsc.vehicle_service_backend.dto.SparePartIncomeResponse;
import java.util.List;
import java.util.Map;

public interface SparePartIncomeService {
    List<SparePartIncomeResponse> getAllIncomes();
    SparePartIncomeResponse getIncomeById(Long id);
    List<SparePartIncomeResponse> getPendingIncomes();
    SparePartIncomeResponse createIncome(SparePartIncomeRequest request);
    SparePartIncomeResponse receiveIncome(Long id);
    SparePartIncomeResponse cancelIncome(Long id);
    void deleteIncome(Long id);
    Map<String, Object> getChartDataByCategory(Long categoryId);
}