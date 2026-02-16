// src/components/spareparts/CategoryForm.jsx
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  Divider,
  Stack
} from '@mui/material';
import {
  Save as SaveIcon,
  Category as CategoryIcon,
  Code as CodeIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import sparePartCategoryService from '../../services/sparePartCategoryService';

const CategoryForm = ({ category, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    categoryCode: '',
    categoryName: ''
  });
  const [errors, setErrors] = useState({});
  const [nextCategoryCode, setNextCategoryCode] = useState('CAT_1');

  useEffect(() => {
    const fetchNextCode = async () => {
      try {
        const categories = await sparePartCategoryService.getAllCategories();
        const maxCode = categories.reduce((max, cat) => {
          if (cat.categoryCode?.startsWith('CAT_')) {
            const num = parseInt(cat.categoryCode.substring(4)) || 0;
            return Math.max(max, num);
          }
          return max;
        }, 0);
        setNextCategoryCode(`CAT_${maxCode + 1}`);
      } catch (err) {
        console.error('Error fetching next code:', err);
      }
    };

    if (!category) {
      fetchNextCode();
    }
  }, [category]);

  useEffect(() => {
    if (category) {
      setFormData({
        categoryCode: category.categoryCode || '',
        categoryName: category.categoryName || ''
      });
    } else {
      setFormData(prev => ({ ...prev, categoryCode: nextCategoryCode }));
    }
  }, [category, nextCategoryCode]);

  const validate = () => {
    const newErrors = {};
    if (!formData.categoryName.trim()) newErrors.categoryName = 'Category Designation is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 1 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
            TAXONOMY SPECIFICATIONS
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth label="Registry ID" disabled
            value={formData.categoryCode}
            InputProps={{
              startAdornment: <InputAdornment position="start"><CodeIcon color="primary" fontSize="small" /></InputAdornment>,
              sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.03)' }
            }}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <TextField
            required fullWidth label="Category Designation" name="categoryName"
            value={formData.categoryName}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, categoryName: e.target.value }));
              if (errors.categoryName) setErrors(prev => ({ ...prev, categoryName: '' }));
            }}
            error={!!errors.categoryName} helperText={errors.categoryName || 'e.g. Engine Block, Transmission Gearbox'}
            InputProps={{
              startAdornment: <InputAdornment position="start"><CategoryIcon color="primary" fontSize="small" /></InputAdornment>,
              sx: { borderRadius: 2 }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{
            p: 2,
            bgcolor: 'primary.light',
            borderRadius: 3,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: 2 }}>
              <CategoryIcon />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="bold">Classification Tip</Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Use granular categories to make search and maintenance records more precise for technicians.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          onClick={onCancel} variant="outlined"
          sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 'bold' }}
        >
          Discard
        </Button>
        <Button
          type="submit" variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          disabled={loading}
          sx={{
            borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
          }}
        >
          {category ? 'Update Taxonomy' : 'Confirm Registration'}
        </Button>
      </Stack>
    </Box>
  );
};

export default CategoryForm;
