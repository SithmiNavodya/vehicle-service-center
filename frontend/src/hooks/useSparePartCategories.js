// src/hooks/useSparePartCategories.js
import { useState, useEffect, useCallback } from 'react';
import sparePartCategoryService from '../services/sparePartCategoryService';

export const useSparePartCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sparePartCategoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search categories
  const searchCategories = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sparePartCategoryService.searchCategories(searchTerm);
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Failed to search categories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new category
  const createCategory = async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const newCategory = await sparePartCategoryService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err.message || 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update category
  const updateCategory = async (id, categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategory = await sparePartCategoryService.updateCategory(id, categoryData);
      setCategories(prev => prev.map(cat =>
        cat.id === id ? updatedCategory : cat
      ));
      return updatedCategory;
    } catch (err) {
      setError(err.message || 'Failed to update category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await sparePartCategoryService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Select category
  const selectCategory = (category) => {
    setSelectedCategory(category);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedCategory(null);
  };

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    selectedCategory,
    fetchCategories,
    searchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    selectCategory,
    clearSelection
  };
};