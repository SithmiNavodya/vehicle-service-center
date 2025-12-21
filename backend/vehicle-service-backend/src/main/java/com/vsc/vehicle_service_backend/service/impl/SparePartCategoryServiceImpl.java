package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.dto.SparePartCategoryRequest;
import com.vsc.vehicle_service_backend.dto.SparePartCategoryResponse;
import com.vsc.vehicle_service_backend.entity.SparePartCategory;
import com.vsc.vehicle_service_backend.exception.ResourceNotFoundException;
import com.vsc.vehicle_service_backend.exception.DuplicateResourceException;
import com.vsc.vehicle_service_backend.repository.SparePartCategoryRepository;
import com.vsc.vehicle_service_backend.service.SparePartCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SparePartCategoryServiceImpl implements SparePartCategoryService {

    @Autowired
    private SparePartCategoryRepository categoryRepository;

    @Override
    public SparePartCategoryResponse createCategory(SparePartCategoryRequest request) {
        if (categoryRepository.existsByCategoryCode(request.getCategoryCode())) {
            throw new DuplicateResourceException(
                    "Category with code '" + request.getCategoryCode() + "' already exists"
            );
        }

        if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new DuplicateResourceException(
                    "Category with name '" + request.getCategoryName() + "' already exists"
            );
        }

        SparePartCategory category = new SparePartCategory();
        category.setCategoryCode(request.getCategoryCode());
        category.setCategoryName(request.getCategoryName());

        SparePartCategory savedCategory = categoryRepository.save(category);
        return mapToResponse(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public SparePartCategoryResponse getCategoryById(Long id) {
        SparePartCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + id
                ));
        return mapToResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public SparePartCategoryResponse getCategoryByCode(String categoryCode) {
        SparePartCategory category = categoryRepository.findByCategoryCode(categoryCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with code: " + categoryCode
                ));
        return mapToResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SparePartCategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SparePartCategoryResponse updateCategory(Long id, SparePartCategoryRequest request) {
        SparePartCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + id
                ));

        if (!category.getCategoryCode().equals(request.getCategoryCode()) &&
                categoryRepository.existsByCategoryCode(request.getCategoryCode())) {
            throw new DuplicateResourceException(
                    "Category code '" + request.getCategoryCode() + "' already exists"
            );
        }

        if (!category.getCategoryName().equals(request.getCategoryName()) &&
                categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new DuplicateResourceException(
                    "Category name '" + request.getCategoryName() + "' already exists"
            );
        }

        category.setCategoryCode(request.getCategoryCode());
        category.setCategoryName(request.getCategoryName());

        SparePartCategory updatedCategory = categoryRepository.save(category);
        return mapToResponse(updatedCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByCategoryCode(String categoryCode) {
        return categoryRepository.existsByCategoryCode(categoryCode);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByCategoryName(String categoryName) {
        return categoryRepository.existsByCategoryName(categoryName);
    }

    private SparePartCategoryResponse mapToResponse(SparePartCategory category) {
        return new SparePartCategoryResponse(
                category.getId(),
                category.getCategoryCode(),
                category.getCategoryName()
        );
    }
}