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
  Select,
  TextareaAutosize
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ServiceRecordForm = ({ record, vehicles, services, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceId: '',
    serviceDate: new Date(),
    nextServiceDate: null,
    status: 'PENDING',
    notes: '',
    totalAmount: 0
  });
  const [errors, setErrors] = useState({});

  const statusOptions = ['PENDING', 'COMPLETED', 'IN_PROGRESS', 'CANCELLED'];

  useEffect(() => {
    if (record && isEditing) {
      console.log('Editing record:', record);
      setFormData({
        vehicleId: record.vehicleId || record.vehicle?.id || '',
        serviceId: record.serviceId || record.service?.id || '',
        serviceDate: record.serviceDate ? new Date(record.serviceDate) : new Date(),
        nextServiceDate: record.nextServiceDate ? new Date(record.nextServiceDate) : null,
        status: record.status || 'PENDING',
        notes: record.notes || '',
        totalAmount: record.totalAmount || 0
      });
    }
  }, [record, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Vehicle is required';
    }

    if (!formData.serviceId) {
      newErrors.serviceId = 'Service is required';
    }

    if (!formData.serviceDate) {
      newErrors.serviceDate = 'Service date is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
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

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

 const handleSubmit = (e) => {
   e.preventDefault();
   if (validateForm()) {
     // Helper function to format dates correctly for LocalDate
     const formatDateForLocalDate = (date) => {
       if (!date) return null;
       // Converts a Date object to 'YYYY-MM-DD' string
       return date.toISOString().split('T')[0];
     };

     // Format data for backend - match LocalDate format
     const submitData = {
       vehicleId: Number(formData.vehicleId),
       serviceId: Number(formData.serviceId),
       serviceDate: formatDateForLocalDate(formData.serviceDate),
       nextServiceDate: formatDateForLocalDate(formData.nextServiceDate), // Can be null
       status: formData.status || 'PENDING',
       notes: formData.notes || '',
     };

     console.log('📤 Submitting service record:', submitData);
     onSubmit(submitData);
   }
 };

  // Calculate total amount when service changes
  useEffect(() => {
    if (formData.serviceId) {
      const selectedService = services.find(s => s.id === Number(formData.serviceId));
      if (selectedService && selectedService.price) {
        setFormData(prev => ({
          ...prev,
          totalAmount: selectedService.price
        }));
      }
    }
  }, [formData.serviceId, services]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isEditing ? 'Edit Service Record' : 'Add New Service Record'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.vehicleId}>
                <InputLabel>Vehicle *</InputLabel>
                <Select
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  label="Vehicle *"
                >
                  <MenuItem value="">
                    <em>Select Vehicle</em>
                  </MenuItem>
                  {vehicles.map(vehicle => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicleNumber} ({vehicle.brand} {vehicle.model})
                    </MenuItem>
                  ))}
                </Select>
                {errors.vehicleId && (
                  <Typography variant="caption" color="error">
                    {errors.vehicleId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.serviceId}>
                <InputLabel>Service *</InputLabel>
                <Select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  label="Service *"
                >
                  <MenuItem value="">
                    <em>Select Service</em>
                  </MenuItem>
                  {services.map(service => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.serviceName} (${service.price})
                    </MenuItem>
                  ))}
                </Select>
                {errors.serviceId && (
                  <Typography variant="caption" color="error">
                    {errors.serviceId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.serviceDate}>
                <DatePicker
                  label="Service Date *"
                  value={formData.serviceDate}
                  onChange={(date) => handleDateChange('serviceDate', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.serviceDate}
                      helperText={errors.serviceDate}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Next Service Date"
                value={formData.nextServiceDate}
                onChange={(date) => handleDateChange('nextServiceDate', date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status *</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status *"
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && (
                  <Typography variant="caption" color="error">
                    {errors.status}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Amount ($)"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                type="number"
                InputProps={{
                  readOnly: true // Auto-calculated from service
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel shrink>Notes</InputLabel>
                <TextareaAutosize
                  minRows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes about the service..."
                  style={{
                    width: '100%',
                    padding: '16.5px 14px',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    resize: 'vertical'
                  }}
                />
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
                  {isEditing ? 'Update Record' : 'Add Record'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default ServiceRecordForm;