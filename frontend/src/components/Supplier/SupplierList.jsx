// src/components/Supplier/SupplierList.jsx
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
  Avatar,
  Divider,
  Tooltip,
  CircularProgress,
  Paper,
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Store as StoreIcon,
  LocationOn as MapPinIcon,
  Assignment as CodeIcon
} from '@mui/icons-material';

const SupplierList = ({ suppliers, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
        <CircularProgress size={40} />
        <Typography color="textSecondary">Fetching supplier records...</Typography>
      </Box>
    );
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <Paper elevation={0} sx={{
        textAlign: 'center',
        py: 10,
        border: '1px dashed #ccc',
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.02)'
      }}>
        <BusinessIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>No Partners Found</Typography>
        <Typography variant="body2" color="textSecondary">Register a new supplier to start managing inventory procurement</Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {suppliers.map((supplier) => (
        <Grid item xs={12} sm={6} md={4} key={supplier.id}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 4,
              border: '1px solid #eef2f6',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
                borderColor: 'primary.light'
              }
            }}
          >
            <Box sx={{ p: 3, pb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Chip
                  label={supplier.supplierCode || `S_${supplier.id}`}
                  sx={{
                    fontWeight: 'bold',
                    borderRadius: 1.5,
                    backgroundColor: 'primary.light',
                    color: 'white',
                    fontSize: '0.75rem'
                  }}
                />
                <Chip
                  label="Registered Supplier"
                  size="small"
                  variant="outlined"
                  icon={<StoreIcon sx={{ fontSize: '1rem !important' }} />}
                  sx={{ borderRadius: 1.5, fontWeight: 500 }}
                />
              </Box>

              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(25,118,210,0.1)', color: 'primary.main', width: 48, height: 48 }}>
                  <StoreIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2 }}>
                    {supplier.supplierName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" fontWeight="500">
                    Inventory Partner
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2, opacity: 0.6 }} />

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.light', fontSize: '0.75rem' }}>
                    <EmailIcon sx={{ fontSize: '1.1rem' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="textSecondary" display="block">Email Address</Typography>
                    <Typography variant="body2" fontWeight="700">{supplier.email || 'N/A'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'success.light', fontSize: '0.75rem' }}>
                    <PhoneIcon sx={{ fontSize: '1rem' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="textSecondary" display="block">Emergency Contact</Typography>
                    <Typography variant="body2" fontWeight="700">{supplier.phone || 'N/A'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'info.light', fontSize: '0.75rem' }}>
                    <MapPinIcon sx={{ fontSize: '1.1rem' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="textSecondary" display="block">Business Address</Typography>
                    <Typography variant="body2" fontWeight="700" sx={{ lineHeight: 1.4 }}>
                      {supplier.address || 'Location Not Recorded'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ mt: 'auto', p: 3, pt: 1 }}>
              <Stack direction="row" spacing={1.5}>
                <Button
                  size="small"
                  onClick={() => onEdit(supplier)}
                  fullWidth
                  variant="outlined"
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                  Modify
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    if (window.confirm(`Permanently decommission supplier "${supplier.supplierName}"?`)) {
                      onDelete(supplier.id);
                    }
                  }}
                  fullWidth
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    bgcolor: 'error.main',
                    boxShadow: 'none'
                  }}
                >
                  Archive
                </Button>
              </Stack>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SupplierList;
