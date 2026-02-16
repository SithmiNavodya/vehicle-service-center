// src/pages/Inventory/CategoriesPage.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Paper,
  Breadcrumbs,
  Link,
  Snackbar,
  Stack,
  Grid,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Category as CategoryIcon,
  Class as ClassIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCreate = async (categoryData) => {
    try {
      await createCategory(categoryData);
      setShowForm(false);
      showSnackbar('Category registered successfully!', 'success');
      fetchCategories();
    } catch (err) {
      showSnackbar('Failed to create category.', 'error');
    }
  };

  const handleUpdate = async (categoryData) => {
    try {
      await updateCategory(editingCategory.id, categoryData);
      setEditingCategory(null);
      setShowForm(false);
      showSnackbar('Category updated successfully.', 'success');
      fetchCategories();
    } catch (err) {
      showSnackbar('Failed to update category.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      showSnackbar('Category removed from records.', 'success');
      fetchCategories();
    } catch (err) {
      showSnackbar('Failed to delete category.', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Stats Card Component
  const StatCard = ({ title, value, icon, color, bg }) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        background: bg,
        color: color,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.03)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, transform: 'rotate(15deg)', color: color }}>
          {React.cloneElement(icon, { sx: { fontSize: 80 } })}
        </Box>

        <Stack spacing={0.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {React.cloneElement(icon, { sx: { fontSize: 24 } })}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 1 }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>
            {value}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', opacity: 0.8 }}>
            Operational Taxonomy Group
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
          <Typography color="primary.main" fontWeight="500">Inventory</Typography>
          <Typography color="text.primary" fontWeight="500">Categories</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CategoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              Classification Center
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Define and organize spare part groups for hierarchical inventory tracking
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            New Category
          </Button>
        </Box>
      </Box>

      {/* Stats Dashboard */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard title="Defined Categories" value={categories.length} icon={<ClassIcon />} color="#1976d2" bg="linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Active Groups" value={categories.length} icon={<InventoryIcon />} color="#2e7d32" bg="linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Taxonomy Items" value={categories.length} icon={<TrendingIcon />} color="#9c27b0" bg="linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)" />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Box sx={{ position: 'relative' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
            <Button size="small" onClick={fetchCategories} sx={{ ml: 2 }}>Retry</Button>
          </Alert>
        )}

        <CategoryList
          categories={categories}
          onEdit={(category) => {
            setEditingCategory(category);
            setShowForm(true);
          }}
          onDelete={handleDelete}
          onSearch={searchCategories}
          onRefresh={fetchCategories}
          loading={loading}
        />
      </Box>

      {/* Form Dialog */}
      {(showForm || editingCategory) && (
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
          loading={loading}
        />
      )}

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoriesPage;
