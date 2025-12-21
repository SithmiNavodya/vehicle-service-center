package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.dto.SparePartCategoryRequest;
import com.vsc.vehicle_service_backend.dto.SparePartCategoryResponse;
import java.util.List;

public interface SparePartCategoryService {

    SparePartCategoryResponse createCategory(SparePartCategoryRequest request);

    SparePartCategoryResponse getCategoryById(Long id);

    SparePartCategoryResponse getCategoryByCode(String categoryCode);

    List<SparePartCategoryResponse> getAllCategories();

    SparePartCategoryResponse updateCategory(Long id, SparePartCategoryRequest request);

    void deleteCategory(Long id);

    boolean existsByCategoryCode(String categoryCode);

    boolean existsByCategoryName(String categoryName);
}