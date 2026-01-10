// src/pages/SparePartCategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useSparePartCategories } from '../hooks/useSparePartCategories';
import CategoryList from '../components/spareparts/CategoryList';
import CategoryForm from '../components/spareparts/CategoryForm';

const SparePartCategoriesPage = () => {
  const {
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
  } = useSparePartCategories();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Debug: Check data
  useEffect(() => {
    console.log('Categories:', categories);
    console.log('Selected category:', selectedCategory);
  }, [categories, selectedCategory]);

  // Handle create category
  const handleCreate = async (categoryData) => {
    try {
      await createCategory(categoryData);
      setShowForm(false);
      showSnackbar('Category created successfully!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to create category', 'error');
    }
  };

  // Handle update category
  const handleUpdate = async (categoryData) => {
    try {
      await updateCategory(editingCategory.id, categoryData);
      setEditingCategory(null);
      showSnackbar('Category updated successfully!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to update category', 'error');
    }
  };

  // Handle edit category
  const handleEdit = (category) => {
    setEditingCategory(category);
    selectCategory(category);
  };

  // Handle delete confirmation
  const handleDeleteClick = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmed
  const handleDeleteConfirmed = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id);
        showSnackbar('Category deleted successfully!', 'success');
      } catch (err) {
        showSnackbar(err.message || 'Failed to delete category', 'error');
      }
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    searchCategories(searchTerm);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchCategories();
  };

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    clearSelection();
  };

  // Show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Spare Part Categories
          </Typography>

          {!showForm && !editingCategory && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
            >
              Add Category
            </Button>
          )}
        </Box>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          Manage your spare part categories. Categories help organize spare parts for better inventory management.
        </Typography>
      </Box>

      {/* Form Section */}
      {(showForm || editingCategory) && (
        <Box sx={{ mb: 4 }}>
          <CategoryForm
            category={editingCategory}
            onSubmit={editingCategory ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEditing={!!editingCategory}
            loading={loading}
          />
        </Box>
      )}

      {/* Categories List Section */}
      {!showForm && !editingCategory && (
        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.default' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            All Categories ({categories.length})
          </Typography>

          <CategoryList
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onSearch={handleSearch}
            onRefresh={handleRefresh}
            loading={loading}
            error={error}
          />
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Delete Category
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete category "
            <strong>{categoryToDelete?.categoryName}</strong>
            " ({categoryToDelete?.categoryCode})?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone. All spare parts in this category will need to be reassigned.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmed}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SparePartCategoriesPage;