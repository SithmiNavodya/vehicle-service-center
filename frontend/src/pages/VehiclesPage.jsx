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
import { useNavigate } from 'react-router-dom';

import { Add as AddIcon } from '@mui/icons-material';
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
    deleteVehicle,
    fetchVehicles
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Vehicle Management
          </Typography>

          {!showForm && !editingVehicle && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
            >
              Add New Vehicle
            </Button>
          )}
        </Box>

        <VehicleStats vehicles={vehicles} />
      </Box>

      {(showForm || editingVehicle) && (
        <Box sx={{ mb: 4 }}>
          <VehicleForm
            vehicle={editingVehicle}
            customers={customers}
            onSubmit={editingVehicle ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEditing={!!editingVehicle}
          />
        </Box>
      )}

      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.default' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          All Vehicles ({vehicles.length})
        </Typography>

        {error && !loading && (
          <Alert severity="error" sx={{ mb: 2 }}>
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

export default VehiclesPage;