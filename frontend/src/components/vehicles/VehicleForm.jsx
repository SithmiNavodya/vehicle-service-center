import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

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
      newErrors.vehicleNumber = 'Vehicle number is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.vehicleType.trim()) {
      newErrors.vehicleType = 'Vehicle type is required';
    }

    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vehicle Number *"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              error={!!errors.vehicleNumber}
              helperText={errors.vehicleNumber}
              placeholder="e.g., MH-12-AB-1234"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.customerId}>
              <InputLabel>Customer *</InputLabel>
              <Select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                label="Customer *"
              >
                <MenuItem value="">
                  <em>Select Customer</em>
                </MenuItem>
                {customers.map(customer => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </MenuItem>
                ))}
              </Select>
              {errors.customerId && (
                <Typography variant="caption" color="error">
                  {errors.customerId}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Brand *"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              error={!!errors.brand}
              helperText={errors.brand}
              placeholder="e.g., Toyota, Honda"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Model *"
              name="model"
              value={formData.model}
              onChange={handleChange}
              error={!!errors.model}
              helperText={errors.model}
              placeholder="e.g., Camry, Civic"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.vehicleType}>
              <InputLabel>Vehicle Type *</InputLabel>
              <Select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                label="Vehicle Type *"
              >
                <MenuItem value="">
                  <em>Select Type</em>
                </MenuItem>
                {vehicleTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.vehicleType && (
                <Typography variant="caption" color="error">
                  {errors.vehicleType}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default VehicleForm;