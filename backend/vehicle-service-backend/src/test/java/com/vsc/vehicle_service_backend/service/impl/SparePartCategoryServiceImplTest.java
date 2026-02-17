package com.vsc.vehicle_service_backend.service.impl;

import com.vsc.vehicle_service_backend.entity.SparePartCategory;
import com.vsc.vehicle_service_backend.repository.SparePartCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SparePartCategoryServiceImplTest {

    @Mock
    private SparePartCategoryRepository categoryRepository;

    @InjectMocks
    private SparePartCategoryServiceImpl categoryService;

    private SparePartCategory category1;
    private SparePartCategory category2;

    @BeforeEach
    void setUp() {
        // Initialize test data
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
    void getAllCategories_ShouldReturnListOfCategories() {
        // Arrange
        when(categoryRepository.findAll()).thenReturn(Arrays.asList(category1, category2));

        // Act
        List<SparePartCategory> result = categoryService.getAllCategories();

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(category1, category2);
        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    void getCategoryById_WithValidId_ShouldReturnCategory() {
        // Arrange
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category1));

        // Act
        SparePartCategory result = categoryService.getCategoryById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getCategoryCode()).isEqualTo("CAT_001");
        assertThat(result.getCategoryName()).isEqualTo("Engine Parts");
        verify(categoryRepository, times(1)).findById(1L);
    }

    @Test
    void getCategoryById_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> categoryService.getCategoryById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Category not found with id: 99");

        verify(categoryRepository, times(1)).findById(99L);
    }

    @Test
    void createCategory_WithValidData_ShouldCreateCategory() {
        // Arrange
        SparePartCategory newCategory = new SparePartCategory();
        newCategory.setCategoryCode("CAT_003");
        newCategory.setCategoryName("Electrical Parts");

        when(categoryRepository.existsByCategoryCode("CAT_003")).thenReturn(false);
        when(categoryRepository.save(any(SparePartCategory.class))).thenAnswer(invocation -> {
            SparePartCategory saved = invocation.getArgument(0);
            saved.setId(3L);
            return saved;
        });

        // Act
        SparePartCategory result = categoryService.createCategory(newCategory);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(3L);
        assertThat(result.getCategoryCode()).isEqualTo("CAT_003");
        assertThat(result.getCategoryName()).isEqualTo("Electrical Parts");
        assertThat(result.getCreatedAt()).isNotNull();
        assertThat(result.getUpdatedAt()).isNotNull();

        verify(categoryRepository, times(1)).existsByCategoryCode("CAT_003");
        verify(categoryRepository, times(1)).save(any(SparePartCategory.class));
    }

    @Test
    void createCategory_WithDuplicateCode_ShouldThrowException() {
        // Arrange
        SparePartCategory newCategory = new SparePartCategory();
        newCategory.setCategoryCode("CAT_001");
        newCategory.setCategoryName("Duplicate Category");

        when(categoryRepository.existsByCategoryCode("CAT_001")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> categoryService.createCategory(newCategory))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Category code already exists: CAT_001");

        verify(categoryRepository, times(1)).existsByCategoryCode("CAT_001");
        verify(categoryRepository, never()).save(any(SparePartCategory.class));
    }

    @Test
    void updateCategory_WithValidData_ShouldUpdateCategory() {
        // Arrange
        SparePartCategory updateData = new SparePartCategory();
        updateData.setCategoryName("Updated Engine Parts");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category1));
        when(categoryRepository.save(any(SparePartCategory.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        SparePartCategory result = categoryService.updateCategory(1L, updateData);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getCategoryCode()).isEqualTo("CAT_001");
        assertThat(result.getCategoryName()).isEqualTo("Updated Engine Parts");
        assertThat(result.getUpdatedAt()).isNotNull();

        verify(categoryRepository, times(1)).findById(1L);
        verify(categoryRepository, times(1)).save(any(SparePartCategory.class));
    }

    @Test
    void updateCategory_WithInvalidId_ShouldThrowException() {
        // Arrange
        SparePartCategory updateData = new SparePartCategory();
        updateData.setCategoryName("Updated Name");

        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> categoryService.updateCategory(99L, updateData))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Category not found with id: 99");

        verify(categoryRepository, times(1)).findById(99L);
        verify(categoryRepository, never()).save(any(SparePartCategory.class));
    }

    @Test
    void deleteCategory_WithValidId_ShouldDeleteCategory() {
        // Arrange
        when(categoryRepository.existsById(1L)).thenReturn(true);
        doNothing().when(categoryRepository).deleteById(1L);

        // Act
        categoryService.deleteCategory(1L);

        // Assert
        verify(categoryRepository, times(1)).existsById(1L);
        verify(categoryRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteCategory_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(categoryRepository.existsById(99L)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> categoryService.deleteCategory(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Category not found with id: 99");

        verify(categoryRepository, times(1)).existsById(99L);
        verify(categoryRepository, never()).deleteById(anyLong());
    }

    @Test
    void searchCategories_WithQuery_ShouldReturnMatchingCategories() {
        // Arrange
        String query = "Engine";
        when(categoryRepository.findByCategoryNameContainingIgnoreCaseOrCategoryCodeContainingIgnoreCase(query, query))
                .thenReturn(Arrays.asList(category1));

        // Act
        List<SparePartCategory> result = categoryService.searchCategories(query);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCategoryName()).contains("Engine");
        verify(categoryRepository, times(1))
                .findByCategoryNameContainingIgnoreCaseOrCategoryCodeContainingIgnoreCase(query, query);
    }

    @Test
    void searchCategories_WithEmptyQuery_ShouldReturnEmptyList() {
        // Arrange
        String query = "";
        when(categoryRepository.findByCategoryNameContainingIgnoreCaseOrCategoryCodeContainingIgnoreCase(query, query))
                .thenReturn(Arrays.asList());

        // Act
        List<SparePartCategory> result = categoryService.searchCategories(query);

        // Assert
        assertThat(result).isEmpty();
        verify(categoryRepository, times(1))
                .findByCategoryNameContainingIgnoreCaseOrCategoryCodeContainingIgnoreCase(query, query);
    }
}