// src/pages/VehiclesPage.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Add as AddIcon,
  DirectionsCar as CarIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { useVehicles } from '../hooks/useVehicles';
import VehicleList from '../components/vehicles/VehicleList';
import VehicleForm from '../components/vehicles/VehicleForm';
import VehicleStats from '../components/vehicles/VehicleStats';

const VehiclesPage = () => {
  const navigate = useNavigate();
  const {
    vehicles,
    customers,
    loading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle
  } = useVehicles();

  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleViewRecords = (vehicleId) => {
    navigate(`/vehicles/${vehicleId}/records`);
  };

  const handleCreate = async (vehicleData) => {
    try {
      await createVehicle(vehicleData);
      setShowForm(false);
      showSnackbar('Vehicle created successfully!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to create vehicle', 'error');
    }
  };

  const handleUpdate = async (vehicleData) => {
    try {
      await updateVehicle(editingVehicle.id, vehicleData);
      setEditingVehicle(null);
      showSnackbar('Vehicle updated successfully!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to update vehicle', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVehicle(id);
      showSnackbar('Vehicle deleted successfully!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete vehicle', 'error');
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVehicle(null);
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
          <Typography color="primary.main" fontWeight="500">Vehicles</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              Vehicle Management
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Track and manage all vehicles registered in the system
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
            Add New Vehicle
          </Button>
        </Box>
      </Box>

      {/* Stats Summary */}
      <Box sx={{ mb: 4 }}>
        <VehicleStats vehicles={vehicles} />
      </Box>

      {/* Main List Section */}
      <Box sx={{ position: 'relative' }}>
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <VehicleList
          vehicles={vehicles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewRecords={handleViewRecords}
          loading={loading}
          error={error}
        />
      </Box>

      {/* Form Dialog */}
      {(showForm || editingVehicle) && (
        <VehicleForm
          vehicle={editingVehicle}
          customers={customers}
          onSubmit={editingVehicle ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          isEditing={!!editingVehicle}
        />
      )}

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VehiclesPage;
