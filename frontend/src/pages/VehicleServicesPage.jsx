// src/pages/VehicleServicesPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  Paper,
  Breadcrumbs,
  Link,
  Stack,
  Dialog,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  NavigateNext as NavigateNextIcon,
  Build as ServiceIcon
} from '@mui/icons-material';
import { useVehicleServices } from '../hooks/useVehicleServices';
import ServiceList from '../components/vehicleservices/ServiceList';
import ServiceForm from '../components/vehicleservices/ServiceForm';
import ServiceStats from '../components/vehicleservices/ServiceStats';

const VehicleServicesPage = () => {
  const {
    services,
    loading,
    error,
    createService,
    updateService,
    deleteService,
    fetchServices
  } = useVehicleServices();

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleCreate = async (serviceData) => {
    try {
      await createService(serviceData);
      setShowForm(false);
      showSnackbar('Service registered in catalog!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to create service', 'error');
    }
  };

  const handleUpdate = async (serviceData) => {
    try {
      await updateService(editingService.id, serviceData);
      setEditingService(null);
      showSnackbar('Service specifications updated!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to update service', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      showSnackbar('Service removed from ecosystem.', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete service', 'error');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleRefresh = async () => {
    try {
      await fetchServices();
      showSnackbar('Catalog synchronized!', 'success');
    } catch (err) {
      showSnackbar('Sync failed', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
          <Typography color="primary.main" fontWeight="500">Inventory</Typography>
          <Typography color="text.primary" fontWeight="500">Services</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ServiceIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              Service Catalog
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Manage expert maintenance solutions and operational pricing structures
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Add New Service
          </Button>
        </Box>
      </Box>

      {/* Stats Dashboard */}
      <Box sx={{ mb: 4 }}>
        <ServiceStats services={services} />
      </Box>

      {/* Main Registry Container */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #eee', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.04)', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="800">Operational Service Registry</Typography>
          <Button startIcon={<RefreshIcon />} size="small" onClick={handleRefresh} sx={{ fontWeight: 'bold' }}>Sync</Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ m: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <ServiceList
          services={services}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          error={error}
        />
      </Paper>

      {/* Form Dialog */}
      <Dialog
        open={showForm || !!editingService}
        onClose={() => { setShowForm(false); setEditingService(null); }}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <ServiceForm
          service={editingService}
          onSubmit={editingService ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingService(null); }}
          isEditing={!!editingService}
        />
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VehicleServicesPage;