package com.vsc.vehicle_service_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vsc.vehicle_service_backend.entity.SparePartCategory;
import com.vsc.vehicle_service_backend.service.SparePartCategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SparePartCategoryController.class)
class SparePartCategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SparePartCategoryService categoryService;

    private SparePartCategory category1;
    private SparePartCategory category2;

    @BeforeEach
    void setUp() {
        category1 = new SparePartCategory();
        category1.setId(1L);
        category1.setCategoryCode("CAT_001");
        category1.setCategoryName("Engine Parts");
        category1.setCreatedAt(LocalDateTime.now());
        category1.setUpdatedAt(LocalDateTime.now());

        category2 = new SparePartCategory();
        category2.setId(2L);
        category2.setCategoryCode("CAT_002");
        category2.setCategoryName("Body Parts");
        category2.setCreatedAt(LocalDateTime.now());
        category2.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void getAllCategories_ShouldReturnListOfCategories() throws Exception {
        // Arrange
        when(categoryService.getAllCategories()).thenReturn(Arrays.asList(category1, category2));

        // Act & Assert
        mockMvc.perform(get("/api/v1/spare-part-categories"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].categoryCode", is("CAT_001")))
                .andExpect(jsonPath("$[0].categoryName", is("Engine Parts")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].categoryCode", is("CAT_002")))
                .andExpect(jsonPath("$[1].categoryName", is("Body Parts")));

        verify(categoryService, times(1)).getAllCategories();
    }

    @Test
    void getCategoryById_WithValidId_ShouldReturnCategory() throws Exception {
        // Arrange
        when(categoryService.getCategoryById(1L)).thenReturn(category1);

        // Act & Assert
        mockMvc.perform(get("/api/v1/spare-part-categories/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.categoryCode", is("CAT_001")))
                .andExpect(jsonPath("$.categoryName", is("Engine Parts")));

        verify(categoryService, times(1)).getCategoryById(1L);
    }

    @Test
    void getCategoryById_WithInvalidId_ShouldReturn404() throws Exception {
        // Arrange
        when(categoryService.getCategoryById(99L)).thenThrow(new RuntimeException("Category not found with id: 99"));

        // Act & Assert
        mockMvc.perform(get("/api/v1/spare-part-categories/99"))
                .andExpect(status().isInternalServerError());

        verify(categoryService, times(1)).getCategoryById(99L);
    }

    @Test
    void createCategory_WithValidData_ShouldReturnCreatedCategory() throws Exception {
        // Arrange
        SparePartCategory newCategory = new SparePartCategory();
        newCategory.setCategoryCode("CAT_003");
        newCategory.setCategoryName("Electrical Parts");

        SparePartCategory savedCategory = new SparePartCategory();
        savedCategory.setId(3L);
        savedCategory.setCategoryCode("CAT_003");
        savedCategory.setCategoryName("Electrical Parts");
        savedCategory.setCreatedAt(LocalDateTime.now());
        savedCategory.setUpdatedAt(LocalDateTime.now());

        when(categoryService.createCategory(any(SparePartCategory.class))).thenReturn(savedCategory);

        // Act & Assert
        mockMvc.perform(post("/api/v1/spare-part-categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCategory)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.categoryCode", is("CAT_003")))
                .andExpect(jsonPath("$.categoryName", is("Electrical Parts")));

        verify(categoryService, times(1)).createCategory(any(SparePartCategory.class));
    }

    @Test
    void createCategory_WithDuplicateCode_ShouldReturnError() throws Exception {
        // Arrange
        SparePartCategory newCategory = new SparePartCategory();
        newCategory.setCategoryCode("CAT_001");
        newCategory.setCategoryName("Duplicate Category");

        when(categoryService.createCategory(any(SparePartCategory.class)))
                .thenThrow(new RuntimeException("Category code already exists: CAT_001"));

        // Act & Assert
        mockMvc.perform(post("/api/v1/spare-part-categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCategory)))
                .andExpect(status().isInternalServerError());

        verify(categoryService, times(1)).createCategory(any(SparePartCategory.class));
    }

    @Test
    void updateCategory_WithValidData_ShouldReturnUpdatedCategory() throws Exception {
        // Arrange
        SparePartCategory updateData = new SparePartCategory();
        updateData.setCategoryName("Updated Engine Parts");

        SparePartCategory updatedCategory = new SparePartCategory();
        updatedCategory.setId(1L);
        updatedCategory.setCategoryCode("CAT_001");
        updatedCategory.setCategoryName("Updated Engine Parts");
        updatedCategory.setUpdatedAt(LocalDateTime.now());

        when(categoryService.updateCategory(eq(1L), any(SparePartCategory.class))).thenReturn(updatedCategory);

        // Act & Assert
        mockMvc.perform(put("/api/v1/spare-part-categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.categoryCode", is("CAT_001")))
                .andExpect(jsonPath("$.categoryName", is("Updated Engine Parts")));

        verify(categoryService, times(1)).updateCategory(eq(1L), any(SparePartCategory.class));
    }

    @Test
    void deleteCategory_WithValidId_ShouldReturnNoContent() throws Exception {
        // Arrange
        doNothing().when(categoryService).deleteCategory(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/v1/spare-part-categories/1"))
                .andExpect(status().isNoContent());

        verify(categoryService, times(1)).deleteCategory(1L);
    }

    @Test
    void deleteCategory_WithInvalidId_ShouldReturnError() throws Exception {
        // Arrange
        doThrow(new RuntimeException("Category not found with id: 99")).when(categoryService).deleteCategory(99L);

        // Act & Assert
        mockMvc.perform(delete("/api/v1/spare-part-categories/99"))
                .andExpect(status().isInternalServerError());

        verify(categoryService, times(1)).deleteCategory(99L);
    }

    @Test
    void searchCategories_WithQuery_ShouldReturnMatchingCategories() throws Exception {
        // Arrange
        String query = "Engine";
        when(categoryService.searchCategories(query)).thenReturn(Arrays.asList(category1));

        // Act & Assert
        mockMvc.perform(get("/api/v1/spare-part-categories/search")
                        .param("q", query))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].categoryName", is("Engine Parts")));

        verify(categoryService, times(1)).searchCategories(query);
    }

    @Test
    void searchCategories_WithEmptyQuery_ShouldReturnEmptyList() throws Exception {
        // Arrange
        String query = "";
        when(categoryService.searchCategories(query)).thenReturn(Arrays.asList());

        // Act & Assert
        mockMvc.perform(get("/api/v1/spare-part-categories/search")
                        .param("q", query))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(categoryService, times(1)).searchCategories(query);
    }
}