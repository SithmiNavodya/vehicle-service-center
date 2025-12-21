package com.vsc.vehicle_service_backend.dto;

public class SparePartCategoryResponse {

    private Long id;
    private String categoryCode;
    private String categoryName;

    // Constructors
    public SparePartCategoryResponse() {
    }

    public SparePartCategoryResponse(Long id, String categoryCode, String categoryName) {
        this.id = id;
        this.categoryCode = categoryCode;
        this.categoryName = categoryName;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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