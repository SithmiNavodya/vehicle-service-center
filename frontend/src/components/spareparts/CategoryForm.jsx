// Updated CategoryForm.jsx with direct fetching
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Category as CategoryIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import  sparePartCategoryService  from '../../services/sparePartCategoryService';

const CategoryForm = ({
  category,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    categoryCode: '',
    categoryName: ''
  });
  const [errors, setErrors] = useState({});
  const [existingCategories, setExistingCategories] = useState([]);
  const [fetchingCategories, setFetchingCategories] = useState(false);

  // Fetch existing categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setFetchingCategories(true);
        const categories = await sparePartCategoryService.getAllCategories();
        setExistingCategories(categories || []);
        console.log('✅ Fetched categories:', categories);
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Generate next category code AFTER fetching existing categories
  useEffect(() => {
    if (!category && existingCategories.length > 0) {
      console.log('🔄 Generating code from', existingCategories.length, 'existing categories');

      // Extract all CAT_ numbers
      const categoryNumbers = existingCategories
        .map(cat => {
          if (cat.categoryCode && cat.categoryCode.startsWith('CAT_')) {
            const numStr = cat.categoryCode.substring(4);
            const num = parseInt(numStr);
            return isNaN(num) ? 0 : num;
          }
          return 0;
        })
        .filter(num => num > 0);

      // Find the maximum number
      const maxNumber = categoryNumbers.length > 0
        ? Math.max(...categoryNumbers)
        : 0;

      const nextCode = `CAT_${maxNumber + 1}`;
      console.log('✅ Calculated next code:', nextCode, '(max was:', maxNumber, ')');

      setFormData(prev => ({
        ...prev,
        categoryCode: nextCode
      }));
    } else if (!category) {
      // No existing categories yet
      setFormData(prev => ({
        ...prev,
        categoryCode: 'CAT_1'
      }));
    }
  }, [category, existingCategories]);

  // Initialize form for editing
  useEffect(() => {
    if (category) {
      setFormData({
        categoryCode: category.categoryCode || '',
        categoryName: category.categoryName || ''
      });
    }
  }, [category]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CategoryIcon />
        {category ? 'Edit Category' : 'Add New Category'}
      </Typography>

      {fetchingCategories && !category && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Loading existing categories to generate next code...
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Category Code Field - Read Only */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category Code"
              name="categoryCode"
              value={formData.categoryCode}
              disabled={true}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                    <CodeIcon fontSize="small" color="action" />
                  </Box>
                ),
              }}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#1976d2',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }
              }}
            />
            {!category && existingCategories.length > 0 && (
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Auto-generated • Based on {existingCategories.length} existing categories
              </Typography>
            )}
          </Grid>

          {/* Category Name Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category Name *"
              name="categoryName"
              value={formData.categoryName}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryName: e.target.value }))}
              error={!!errors.categoryName}
              helperText={errors.categoryName || 'Enter descriptive category name'}
              placeholder="e.g., Engine Parts, Brake System, Electrical Components"
              disabled={loading || fetchingCategories}
              required
              autoFocus
            />
          </Grid>

          {/* Show existing categories for reference */}
          {!category && existingCategories.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                  Existing categories ({existingCategories.length}):
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {existingCategories.slice(0, 5).map((cat) => (
                    <Chip
                      key={cat.id}
                      label={`${cat.categoryCode} - ${cat.categoryName}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                  {existingCategories.length > 5 && (
                    <Chip
                      label={`+${existingCategories.length - 5} more`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          )}

          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              mt: 2,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                startIcon={<CancelIcon />}
                disabled={loading || fetchingCategories}
                sx={{ minWidth: 100 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading || fetchingCategories || !formData.categoryCode}
                sx={{ minWidth: 120 }}
              >
                {loading ? 'Saving...' : (category ? 'Update' : 'Create')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CategoryForm;