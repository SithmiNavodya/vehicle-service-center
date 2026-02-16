// src/components/servicerecords/ServiceRecordForm.jsx
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Divider,
  Stack,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Build as ServiceIcon,
  DateRange as DateIcon,
  Notes as NotesIcon,
  CheckCircle as StatusIcon,
  Payment as MoneyIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const ServiceRecordForm = ({ record, vehicles, services, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceId: '',
    serviceDate: new Date().toISOString().split('T')[0],
    nextServiceDate: '',
    status: 'PENDING',
    notes: '',
    totalAmount: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (record && isEditing) {
      setFormData({
        vehicleId: record.vehicleId || record.vehicle?.id || '',
        serviceId: record.serviceId || record.service?.id || '',
        serviceDate: record.serviceDate ? record.serviceDate.split('T')[0] : new Date().toISOString().split('T')[0],
        nextServiceDate: record.nextServiceDate ? record.nextServiceDate.split('T')[0] : '',
        status: record.status || 'PENDING',
        notes: record.notes || '',
        totalAmount: record.totalAmount || 0
      });
    }
  }, [record, isEditing]);

  const validate = () => {
    const temp = {};
    if (!formData.vehicleId) temp.vehicleId = "Asset selection required";
    if (!formData.serviceId) temp.serviceId = "Operational specification required";
    if (!formData.serviceDate) temp.serviceDate = "Timeline entry required";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleServiceChange = (e) => {
    const id = e.target.value;
    const s = services.find(x => x.id === Number(id));
    setFormData(prev => ({
      ...prev,
      serviceId: id,
      totalAmount: s ? s.price : 0
    }));
    if (errors.serviceId) setErrors(p => ({ ...p, serviceId: '' }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      ...formData,
      vehicleId: Number(formData.vehicleId),
      serviceId: Number(formData.serviceId),
      totalAmount: parseFloat(formData.totalAmount)
    };
    onSubmit(submitData);
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit} noValidate>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0 }}>
        <Typography variant="h5" fontWeight="bold">
          {isEditing ? 'Operational Audit' : 'Log Maintenance Task'}
        </Typography>
        <IconButton onClick={onCancel} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="overline" color="primary" fontWeight="bold">Asset & Operation Registry</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select fullWidth label="Select Vehicle Asset" name="vehicleId"
              value={formData.vehicleId}
              onChange={(e) => { setFormData(p => ({ ...p, vehicleId: e.target.value })); if (errors.vehicleId) setErrors(p => ({ ...p, vehicleId: '' })); }}
              error={!!errors.vehicleId} helperText={errors.vehicleId}
              InputProps={{
                startAdornment: <InputAdornment position="start"><CarIcon color="primary" /></InputAdornment>,
                sx: { borderRadius: 2 }
              }}
            >
              {vehicles.map(v => (
                <MenuItem key={v.id} value={v.id}>
                  {v.vehicleNumber} ({v.brand} {v.model})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select fullWidth label="Service Specification" name="serviceId"
              value={formData.serviceId}
              onChange={handleServiceChange}
              error={!!errors.serviceId} helperText={errors.serviceId}
              InputProps={{
                startAdornment: <InputAdornment position="start"><ServiceIcon color="primary" /></InputAdornment>,
                sx: { borderRadius: 2 }
              }}
            >
              {services.map(s => (
                <MenuItem key={s.id} value={s.id}>
                  {s.serviceName} (Rs. {parseFloat(s.price).toLocaleString()})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth type="date" label="Service Timeline" name="serviceDate"
              value={formData.serviceDate}
              onChange={(e) => { setFormData(p => ({ ...p, serviceDate: e.target.value })); if (errors.serviceDate) setErrors(p => ({ ...p, serviceDate: '' })); }}
              error={!!errors.serviceDate} helperText={errors.serviceDate}
              InputProps={{
                startAdornment: <InputAdornment position="start"><DateIcon color="primary" /></InputAdornment>,
                sx: { borderRadius: 2 }
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth type="date" label="Next Due Date" name="nextServiceDate"
              value={formData.nextServiceDate}
              onChange={(e) => setFormData(p => ({ ...p, nextServiceDate: e.target.value }))}
              InputProps={{
                startAdornment: <InputAdornment position="start"><DateIcon color="secondary" /></InputAdornment>,
                sx: { borderRadius: 2 }
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select fullWidth label="Operational Status" name="status"
              value={formData.status}
              onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
              InputProps={{
                startAdornment: <InputAdornment position="start"><StatusIcon color="primary" /></InputAdornment>,
                sx: { borderRadius: 2 }
              }}
            >
              {['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}><Typography variant="caption" color="textSecondary">VALUATION & DOCUMENTATION</Typography></Divider>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth label="Economic Value" value={`Rs. ${parseFloat(formData.totalAmount).toLocaleString()}`}
              disabled
              InputProps={{
                startAdornment: <InputAdornment position="start"><MoneyIcon color="success" /></InputAdornment>,
                sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' }
              }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth multiline rows={2} label="Operational Notes / Findings" name="notes"
              value={formData.notes}
              onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
              placeholder="Record technical observations..."
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}><NotesIcon color="primary" /></InputAdornment>,
                sx: { borderRadius: 3 }
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onCancel} variant="outlined" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 'bold' }}>
          Discard Changes
        </Button>
        <Button
          type="submit" variant="contained" startIcon={<SaveIcon />}
          sx={{
            borderRadius: 2, px: 5, textTransform: 'none', fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
          }}
        >
          {isEditing ? 'Commit Audit' : 'Confirm Registration'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default ServiceRecordForm;