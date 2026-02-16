// src/components/Supplier/SupplierForm.jsx
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
  InputAdornment,
  Divider,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as AddressIcon
} from '@mui/icons-material';
import { supplierService } from '../../services/supplierService';

const SupplierForm = ({ supplier, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    supplierCode: '',
    supplierName: '',
    phone: '',
    email: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextSupplierCode, setNextSupplierCode] = useState('SUP_001');

  useEffect(() => {
    const fetchNextCode = async () => {
      try {
        const suppliers = await supplierService.getAllSuppliers();
        const maxCode = suppliers.reduce((max, s) => {
          if (s.supplierCode?.startsWith('SUP_')) {
            const num = parseInt(s.supplierCode.substring(4)) || 0;
            return Math.max(max, num);
          }
          return max;
        }, 0);
        setNextSupplierCode(`SUP_${String(maxCode + 1).padStart(3, '0')}`);
      } catch (err) {
        console.error('Error fetching next code:', err);
      }
    };

    if (!supplier) {
      fetchNextCode();
    }
  }, [supplier]);

  useEffect(() => {
    if (supplier) {
      setFormData({
        supplierCode: supplier.supplierCode || '',
        supplierName: supplier.supplierName || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
      });
    } else {
      setFormData(prev => ({ ...prev, supplierCode: nextSupplierCode }));
    }
  }, [supplier, nextSupplierCode]);

  const validate = () => {
    const newErrors = {};
    if (!formData.supplierName.trim()) newErrors.supplierName = 'Supplier Name is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to register partner' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {supplier ? 'Update Partner Profile' : 'Register New Supplier'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {supplier ? 'Modify contact details and business information' : 'Onboard a new spare parts provider'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ borderRadius: 2 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ mb: 1 }} />

      <DialogContent sx={{ py: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {errors.submit && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">{errors.submit}</Typography>
              </Grid>
            )}

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth label="Registry Code" disabled
                value={formData.supplierCode}
                InputProps={{ sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.03)' } }}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                required fullWidth label="Company Name" name="supplierName"
                value={formData.supplierName} onChange={handleChange}
                error={!!errors.supplierName} helperText={errors.supplierName}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><BusinessIcon color="primary" fontSize="small" /></InputAdornment>,
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required fullWidth label="Contact Phone" name="phone"
                value={formData.phone} onChange={handleChange}
                error={!!errors.phone} helperText={errors.phone}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PhoneIcon color="primary" fontSize="small" /></InputAdornment>,
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Business Email" name="email"
                value={formData.email} onChange={handleChange}
                error={!!errors.email} helperText={errors.email}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmailIcon color="primary" fontSize="small" /></InputAdornment>,
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth label="Operational Address" name="address" multiline rows={3}
                value={formData.address} onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}><AddressIcon color="primary" fontSize="small" /></InputAdornment>,
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button
            fullWidth onClick={onClose} variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold', py: 1.2 }}
          >
            Cancel
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
            {supplier ? 'Update Records' : 'Confirm Registration'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default SupplierForm;
