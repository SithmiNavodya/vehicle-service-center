import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Paper
} from '@mui/material';

const ServiceForm = ({ service, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    price: '',
    estimatedTime: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (service && isEditing) {
      setFormData({
        serviceName: service.serviceName || '',
        description: service.description || '',
        price: service.price || '',
        estimatedTime: service.estimatedTime || ''
      });
    }
  }, [service, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service name is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.estimatedTime.trim()) {
      newErrors.estimatedTime = 'Estimated time is required';
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

    // Clear error when user starts typing
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
        {isEditing ? 'Edit Service' : 'Add New Service'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Name *"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              error={!!errors.serviceName}
              helperText={errors.serviceName}
              disabled={isEditing}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Price *"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: <span>$</span>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estimated Time *"
              name="estimatedTime"
              value={formData.estimatedTime}
              onChange={handleChange}
              error={!!errors.estimatedTime}
              helperText={errors.estimatedTime}
              placeholder="e.g., 30 minutes, 2 hours"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
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
                {isEditing ? 'Update Service' : 'Add Service'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ServiceForm;