// src/components/spareparts/SparePartForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  MenuItem,
  InputAdornment,
  Divider,
  Stack,
  CircularProgress,
  Chip,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Inventory as InventoryIcon,
  BrandingWatermark as BrandIcon,
  ModelTraining as ModelIcon,
  AttachMoney as PriceIcon,
  Numbers as QuantityIcon,
  Category as CategoryIcon,
  Store as SupplierIcon,
  PhotoCamera as ImageIcon
} from '@mui/icons-material';
import { sparePartService } from '../../services/sparePartService';
import sparePartCategoryService from '../../services/sparePartCategoryService';
import { supplierService } from '../../services/supplierService';

const SparePartForm = ({ part, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    partName: '',
    brand: '',
    model: '',
    price: '',
    quantity: '',
    minQuantity: '10',
    imagePath: '',
    categoryId: '',
    supplierId: ''
  });

  const [nextPartNumber, setNextPartNumber] = useState('PART-001');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [catsData, supsData, allParts] = await Promise.all([
          sparePartCategoryService.getAllCategories(),
          supplierService.getAllSuppliers(),
          sparePartService.getAllSpareParts()
        ]);

        setCategories(Array.isArray(catsData) ? catsData : []);
        setSuppliers(Array.isArray(supsData) ? supsData : []);

        if (!part) {
          const maxPartNumber = allParts.reduce((max, p) => {
            if (p.partCode?.startsWith('PART-')) {
              const num = parseInt(p.partCode.substring(5)) || 0;
              return Math.max(max, num);
            }
            return max;
          }, 0);
          setNextPartNumber(`PART-${String(maxPartNumber + 1).padStart(3, '0')}`);
        }
      } catch (err) {
        console.error('Error loading form dependencies:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [part]);

  useEffect(() => {
    if (part) {
      setFormData({
        partName: part.partName || '',
        brand: part.brand || '',
        model: part.model || '',
        price: part.price?.toString() || '',
        quantity: part.quantity?.toString() || '',
        minQuantity: part.minQuantity?.toString() || '10',
        imagePath: part.imagePath || '',
        categoryId: part.category?.id?.toString() || part.categoryId?.toString() || '',
        supplierId: part.supplier?.id?.toString() || part.supplierId?.toString() || ''
      });
    }
  }, [part]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.partName?.trim()) newErrors.partName = 'Part Name is required';
    if (!formData.price || isNaN(formData.price)) newErrors.price = 'Valid price is required';
    if (!formData.quantity || isNaN(formData.quantity)) newErrors.quantity = 'Current stock quantity required';
    if (!formData.categoryId) newErrors.categoryId = 'Category selection required';
    if (!formData.supplierId) newErrors.supplierId = 'Supplier selection required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        minQuantity: Number(formData.minQuantity || 10),
        categoryId: Number(formData.categoryId),
        supplierId: Number(formData.supplierId)
      };
      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {part ? `Edit Specification: ${part.partCode}` : 'Register New Spare Part'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {part ? 'Update inventory technical details and stock levels' : 'Add new entry to the spare parts repository'}
          </Typography>
        </Box>
        <IconButton onClick={onCancel} size="small" sx={{ borderRadius: 2 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ mb: 1 }} />

      <DialogContent sx={{ py: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* General Info */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                  IDENTIFICATION & SPECIFICATIONS
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <TextField
                  required fullWidth label="Part Name" name="partName"
                  value={formData.partName} onChange={handleChange}
                  error={!!errors.partName} helperText={errors.partName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InventoryIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth label="Auto Part ID" disabled
                  value={part ? part.partCode : nextPartNumber}
                  InputProps={{ sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.03)' } }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth label="Brand" name="brand"
                  value={formData.brand} onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BrandIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth label="Model / Compatibility" name="model"
                  value={formData.model} onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ModelIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select required fullWidth label="Category" name="categoryId"
                  value={formData.categoryId} onChange={handleChange}
                  error={!!errors.categoryId} helperText={errors.categoryId}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 }
                  }}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.categoryName}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>

              {/* Stock & Financials */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                  STOCK LOGISTICS & PRICING
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  required fullWidth label="Unit Price (Rs.)" name="price" type="number"
                  value={formData.price} onChange={handleChange}
                  error={!!errors.price} helperText={errors.price}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PriceIcon color="primary" fontSize="small" /></InputAdornment>,
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  required fullWidth label="Current Stock" name="quantity" type="number"
                  value={formData.quantity} onChange={handleChange}
                  error={!!errors.quantity} helperText={errors.quantity}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><QuantityIcon color="primary" fontSize="small" /></InputAdornment>,
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth label="Reorder Level" name="minQuantity" type="number"
                  value={formData.minQuantity} onChange={handleChange}
                  helperText="Minimum stock threshold"
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <TextField
                  select required fullWidth label="Primary Supplier" name="supplierId"
                  value={formData.supplierId} onChange={handleChange}
                  error={!!errors.supplierId} helperText={errors.supplierId}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SupplierIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 }
                  }}
                >
                  {suppliers.map(sup => (
                    <MenuItem key={sup.id} value={sup.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Typography variant="body2">{sup.supplierName}</Typography>
                        <Chip label={sup.supplierCode} size="small" variant="outlined" sx={{ ml: 1, fontSize: '0.65rem' }} />
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth label="Asset Image URL" name="imagePath"
                  value={formData.imagePath} onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><ImageIcon color="primary" fontSize="small" /></InputAdornment>,
                    sx: { borderRadius: 2 }
                  }}
                  placeholder="https://..."
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button
            fullWidth onClick={onCancel} variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold', py: 1.2 }}
          >
            Discard
          </Button>
          <Button
            fullWidth onClick={handleSubmit} variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={isSubmitting}
            sx={{
              borderRadius: 2, textTransform: 'none', fontWeight: 'bold', py: 1.2,
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
            }}
          >
            {part ? 'Update Repository' : 'Confirm Registration'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default SparePartForm;
