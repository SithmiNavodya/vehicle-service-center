package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.entity.SparePartCategory;
import com.vsc.vehicle_service_backend.repository.SparePartCategoryRepository;
import com.vsc.vehicle_service_backend.service.SparePartCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SparePartCategoryServiceImpl implements SparePartCategoryService {

    @Autowired
    private SparePartCategoryRepository categoryRepository;

    @Override
    public List<SparePartCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public SparePartCategory getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    public SparePartCategory createCategory(SparePartCategory category) {
        // Check if category code already exists
        if (categoryRepository.existsByCategoryCode(category.getCategoryCode())) {
            throw new RuntimeException("Category code already exists: " + category.getCategoryCode());
        }

        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }

    @Override
    public SparePartCategory updateCategory(Long id, SparePartCategory category) {
        SparePartCategory existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        existingCategory.setCategoryName(category.getCategoryName());
        existingCategory.setUpdatedAt(LocalDateTime.now());

        return categoryRepository.save(existingCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public List<SparePartCategory> searchCategories(String query) {
        return categoryRepository.findByCategoryNameContainingIgnoreCaseOrCategoryCodeContainingIgnoreCase(
                query, query);
    }
}