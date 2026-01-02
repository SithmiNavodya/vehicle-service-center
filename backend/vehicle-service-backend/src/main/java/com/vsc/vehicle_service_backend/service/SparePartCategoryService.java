package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.entity.SparePartCategory;
import java.util.List;

public interface SparePartCategoryService {
    List<SparePartCategory> getAllCategories();
    SparePartCategory getCategoryById(Long id);
    SparePartCategory createCategory(SparePartCategory category);
    SparePartCategory updateCategory(Long id, SparePartCategory category);
    void deleteCategory(Long id);
    List<SparePartCategory> searchCategories(String query);
}