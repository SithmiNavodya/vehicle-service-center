package com.vsc.vehicle_service_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SparePartCategoryRequest {

    @NotBlank(message = "Category code is required")
    @Pattern(regexp = "^CAT_\\d+$", message = "Category code must start with CAT_ followed by numbers")
    @Size(min = 4, max = 20, message = "Category code must be between 4 and 20 characters")
    private String categoryCode;

    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 100, message = "Category name must be between 2 and 100 characters")
    private String categoryName;

    // Getters and Setters
    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}