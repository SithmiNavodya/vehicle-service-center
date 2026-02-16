// src/components/vehicles/VehicleForm.jsx
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
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  DirectionsCar as CarIcon,
  BrandingWatermark as BrandIcon,
  ModelTraining as ModelIcon,
  Category as TypeIcon,
  Person as OwnerIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const VehicleForm = ({ vehicle, customers, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    brand: '',
    model: '',
    vehicleType: '',
    customerId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicle && isEditing) {
      setFormData({
        vehicleNumber: vehicle.vehicleNumber || '',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        vehicleType: vehicle.vehicleType || '',
        customerId: vehicle.customer?.id || ''
      });
    }
  }, [vehicle, isEditing]);

  const vehicleTypes = ['Car', 'Bike', 'SUV', 'Truck', 'Van', 'Bus', 'Other'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Registration number is required';
    }
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Please select a type';
    }
    if (!formData.customerId) {
      newErrors.customerId = 'Owner association is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {isEditing ? 'Update Vehicle Details' : 'Register New Vehicle'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {isEditing ? 'Modify registration or model specifications' : 'Enter details to register a vehicle to a customer'}
          </Typography>
        </Box>
        <IconButton onClick={onCancel} size="small" sx={{ borderRadius: 2 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ mb: 1 }} />

      <DialogContent sx={{ py: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Vehicle Number"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                error={!!errors.vehicleNumber}
                helperText={errors.vehicleNumber}
                placeholder="e.g., WP-ABC-1234"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CarIcon color="primary" fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                required
                fullWidth
                label="Assign Owner"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                error={!!errors.customerId}
                helperText={errors.customerId}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <OwnerIcon color="primary" fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
              >
                <MenuItem value="">
                  <em>Select Registered Customer</em>
                </MenuItem>
                {customers.map(customer => (
                  <MenuItem key={customer.id} value={customer.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontWeight="600">{customer.name}</Typography>
                      <Typography variant="caption" color="textSecondary">({customer.phone})</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                error={!!errors.brand}
                helperText={errors.brand}
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
                required
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                error={!!errors.model}
                helperText={errors.model}
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
                select
                required
                fullWidth
                label="Vehicle Type"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                error={!!errors.vehicleType}
                helperText={errors.vehicleType}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TypeIcon color="primary" fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
              >
                {vehicleTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button
            fullWidth
            onClick={onCancel}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold', py: 1.2 }}
          >
            Discard
          </Button>
          <Button
            fullWidth
            onClick={handleSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              py: 1.2,
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
            }}
          >
            {isEditing ? 'Save Changes' : 'Register Vehicle'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default VehicleForm;
