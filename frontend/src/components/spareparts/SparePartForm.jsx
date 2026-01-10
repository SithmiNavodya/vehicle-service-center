// src/components/spareparts/SparePartForm.jsx
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Avatar,
  Chip,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  LocalShipping as LocalShippingIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { sparePartService } from '../../services/sparePartService';
import sparePartCategoryService from '../../services/sparePartCategoryService';
//import { sparePartCategoryService } from '../../services/sparePartCategoryService';
import { supplierService } from '../../services/supplierService';

const SparePartForm = ({
  part,
  onSubmit,
  onCancel,
  loading = false
}) => {
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
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [suppliersLoading, setSuppliersLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setCategoriesLoading(true);
        setSuppliersLoading(true);

        // Load categories
        const catsData = await sparePartCategoryService.getAllCategories();
        setCategories(Array.isArray(catsData) ? catsData : []);

        // Load suppliers
        const supsData = await supplierService.getAllSuppliers();
        setSuppliers(Array.isArray(supsData) ? supsData : []);

        // Generate next part number
        try {
          const allParts = await sparePartService.getAllSpareParts();
          const maxPartNumber = allParts.reduce((max, p) => {
            if (p.partCode && p.partCode.startsWith('PART-')) {
              const num = parseInt(p.partCode.substring(5)) || 0;
              return Math.max(max, num);
            }
            return max;
          }, 0);
          setNextPartNumber(`PART-${String(maxPartNumber + 1).padStart(3, '0')}`);
        } catch (err) {
          console.error('Error generating part number:', err);
          setNextPartNumber('PART-001');
        }

      } catch (err) {
        console.error('Error loading form data:', err);
        setCategories([]);
        setSuppliers([]);
      } finally {
        setCategoriesLoading(false);
        setSuppliersLoading(false);
      }
    };
    loadData();
  }, []);

  // Initialize form with part data if editing
  useEffect(() => {
    if (part) {
      console.log('Editing part:', part);
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

  // Get selected category and supplier
  const selectedCategory = Array.isArray(categories)
    ? categories.find(cat => cat.id?.toString() === formData.categoryId)
    : null;

  const selectedSupplier = Array.isArray(suppliers)
    ? suppliers.find(sup => sup.id?.toString() === formData.supplierId)
    : null;

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.partName?.trim()) {
      newErrors.partName = 'Part name is required';
    }

    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.quantity || isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (!formData.minQuantity || isNaN(formData.minQuantity) || Number(formData.minQuantity) < 1) {
      newErrors.minQuantity = 'Valid minimum quantity is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.supplierId) {
      newErrors.supplierId = 'Supplier is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle select change for category and supplier
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormLoading(true);

    try {
      // Prepare data for submission
      const submitData = {
        partName: formData.partName.trim(),
        brand: formData.brand.trim() || null,
        model: formData.model.trim() || null,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        minQuantity: Number(formData.minQuantity),
        imagePath: formData.imagePath.trim() || null,
        categoryId: Number(formData.categoryId),
        supplierId: Number(formData.supplierId)
      };

      console.log('Form submitting data:', submitData);

      // Call parent handler
      await onSubmit(submitData);

    } catch (error) {
      console.error('Form submission error:', error);
      // Error will be handled by parent component
    } finally {
      setFormLoading(false);
    }
  };

  // Copy part number to clipboard
  const copyPartNumber = () => {
    navigator.clipboard.writeText(nextPartNumber);
    alert(`Copied: ${nextPartNumber}`);
  };

  // Calculate total value for display
  const calculateTotalValue = () => {
    const price = parseFloat(formData.price) || 0;
    const quantity = parseInt(formData.quantity) || 0;
    return price * quantity;
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: part ? 'warning.main' : 'primary.main' }}>
          {part ? <EditIcon /> : <AddIcon />}
        </Avatar>
        <Box>
          <Typography variant="h6">
            {part ? `Edit Spare Part: ${part.partCode}` : 'Add New Spare Part'}
          </Typography>
          {!part && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="body2" color="textSecondary">
                Auto-generated Part Number:
              </Typography>
              <Chip
                label={nextPartNumber}
                color="primary"
                size="small"
                icon={<ContentCopyIcon />}
                onClick={copyPartNumber}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          )}
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          {/* Part Information Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'primary.main',
              fontWeight: 600
            }}>
              <InventoryIcon fontSize="small" />
              Part Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Part Name *"
              name="partName"
              value={formData.partName}
              onChange={handleChange}
              error={!!errors.partName}
              helperText={errors.partName || 'Name of the spare part'}
              placeholder="e.g., Engine Oil Filter"
              disabled={loading || formLoading}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., Bosch, Brembo"
              disabled={loading || formLoading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., Universal Fit, BKR5EIX-11"
              disabled={loading || formLoading}
            />
          </Grid>

          {/* Category Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.categoryId} disabled={categoriesLoading || loading || formLoading}>
              <InputLabel>Category *</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={(e) => handleSelectChange('categoryId', e.target.value)}
                label="Category *"
              >
                {categoriesLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    Loading categories...
                  </MenuItem>
                ) : (!categories || categories.length === 0) ? (
                  <MenuItem disabled>No categories available. Add categories first.</MenuItem>
                ) : (
                  categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Chip
                          label={cat.categoryCode || `CAT-${cat.id}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ minWidth: 70 }}
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {cat.categoryName || 'Unnamed Category'}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.categoryId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors.categoryId}
                </Typography>
              )}
              {selectedCategory && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Selected: {selectedCategory.categoryCode} - {selectedCategory.categoryName}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Stock Information Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'primary.main',
              fontWeight: 600,
              mt: 2
            }}>
              <LocalShippingIcon fontSize="small" />
              Stock Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Unit Price (Rs.) *"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price || 'Price per unit'}
              InputProps={{
                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
              disabled={loading || formLoading}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Quantity *"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              error={!!errors.quantity}
              helperText={errors.quantity || 'Current stock quantity'}
              InputProps={{ inputProps: { min: 0 } }}
              disabled={loading || formLoading}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Min Quantity *"
              name="minQuantity"
              type="number"
              value={formData.minQuantity}
              onChange={handleChange}
              error={!!errors.minQuantity}
              helperText={errors.minQuantity || 'Reorder threshold'}
              InputProps={{ inputProps: { min: 1 } }}
              disabled={loading || formLoading}
              required
            />
          </Grid>

          {/* Total Value Display */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mt: 1 }}>
              Total Inventory Value: Rs. {calculateTotalValue().toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </Alert>
          </Grid>

          {/* Supplier Selection */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'primary.main',
              fontWeight: 600,
              mt: 2
            }}>
              <CategoryIcon fontSize="small" />
              Supplier Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.supplierId} disabled={suppliersLoading || loading || formLoading}>
              <InputLabel>Supplier *</InputLabel>
              <Select
                name="supplierId"
                value={formData.supplierId}
                onChange={(e) => handleSelectChange('supplierId', e.target.value)}
                label="Supplier *"
              >
                {suppliersLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    Loading suppliers...
                  </MenuItem>
                ) : (!suppliers || suppliers.length === 0) ? (
                  <MenuItem disabled>No suppliers available. Add suppliers first.</MenuItem>
                ) : (
                  suppliers.map((sup) => (
                    <MenuItem key={sup.id} value={sup.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Chip
                          label={sup.supplierCode || `SUP-${sup.id}`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{ minWidth: 70 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2">{sup.supplierName || 'Unnamed Supplier'}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {sup.phone || 'No phone'} • {sup.email || 'No email'}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.supplierId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors.supplierId}
                </Typography>
              )}
              {selectedSupplier && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Selected: {selectedSupplier.supplierCode} - {selectedSupplier.supplierName}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL (Optional)"
              name="imagePath"
              value={formData.imagePath}
              onChange={handleChange}
              helperText="URL for part image (optional)"
              placeholder="https://example.com/image.jpg"
              disabled={loading || formLoading}
            />
          </Grid>

          {/* Submit Buttons */}
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
                disabled={loading || formLoading || categoriesLoading || suppliersLoading}
                sx={{ minWidth: 100 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={formLoading ? <CircularProgress size={20} /> : (part ? <EditIcon /> : <AddIcon />)}
                disabled={loading || formLoading || categoriesLoading || suppliersLoading}
                sx={{ minWidth: 120 }}
              >
                {formLoading ? 'Saving...' : (part ? 'Update Part' : 'Save Part')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Information Alerts */}
      {!part && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Part number <strong>{nextPartNumber}</strong> will be auto-generated.
          Category and supplier are required fields.
        </Alert>
      )}

      {formData.minQuantity && parseInt(formData.minQuantity) > 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          When stock reaches {formData.minQuantity} units, this part will be marked as low stock.
        </Alert>
      )}
    </Paper>
  );
};

export default SparePartForm;