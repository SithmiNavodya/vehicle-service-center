import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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

  const handleCreate = async (serviceData) => {
    try {
      await createService(serviceData);
      setShowForm(false);
      showSnackbar('Service created successfully!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to create service', 'error');
    }
  };

  const handleUpdate = async (serviceData) => {
    try {
      await updateService(editingService.id, serviceData);
      setEditingService(null);
      showSnackbar('Service updated successfully!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to update service', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      showSnackbar('Service deleted successfully!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete service', 'error');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Vehicle Services
          </Typography>

          {!showForm && !editingService && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
            >
              Add New Service
            </Button>
          )}
        </Box>

        <ServiceStats services={services} />
      </Box>

      {(showForm || editingService) && (
        <Box sx={{ mb: 4 }}>
          <ServiceForm
            service={editingService}
            onSubmit={editingService ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEditing={!!editingService}
          />
        </Box>
      )}

      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.default' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          All Services ({services.length})
        </Typography>

        {error && !loading && (
          <Alert severity="error" sx={{ mb: 2 }}>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VehicleServicesPage;