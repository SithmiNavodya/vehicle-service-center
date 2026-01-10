// src/pages/Inventory/CategoriesPage.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Grid,
  Paper
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useSparePartCategories } from '../../hooks/useSparePartCategories';
import CategoryList from '../../components/spareparts/CategoryList';
import CategoryForm from '../../components/spareparts/CategoryForm';

const CategoriesPage = () => {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    searchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  } = useSparePartCategories();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleCreate = async (categoryData) => {
    try {
      console.log('Creating category with data:', categoryData);
      await createCategory(categoryData);
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  const handleUpdate = async (categoryData) => {
    try {
      console.log('Updating category:', editingCategory.id, 'with data:', categoryData);
      await updateCategory(editingCategory.id, categoryData);
      setEditingCategory(null);
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this category?')) {
        await deleteCategory(id);
        fetchCategories();
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Failed to delete category');
    }
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      searchCategories(searchTerm);
    } else {
      fetchCategories();
    }
  };

  // Calculate stats
  const stats = {
    total: categories.length,
    popular: categories.slice(0, 3) // Top 3 categories by some metric
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Spare Part Categories
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Organize your spare parts into categories for better inventory management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            Add Category
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h4">{stats.total}</Typography>
              <Typography variant="body2" color="textSecondary">Total Categories</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h4">{stats.popular.length}</Typography>
              <Typography variant="body2" color="textSecondary">Most Used</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h4">5</Typography>
              <Typography variant="body2" color="textSecondary">Sample Parts per Category</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button
            size="small"
            onClick={fetchCategories}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      )}

      {/* Categories List */}
      <CategoryList
        categories={categories}
        onEdit={(category) => {
          setEditingCategory(category);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        onSearch={handleSearch}
        onRefresh={fetchCategories}
        loading={loading}
        error={error}
      />

      {/* Form Dialog */}
      <Dialog
        open={showForm || !!editingCategory}
        onClose={() => {
          setShowForm(false);
          setEditingCategory(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <CategoryForm
              category={editingCategory}
              onSubmit={editingCategory ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditingCategory(null);
              }}
              loading={loading}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CategoriesPage;