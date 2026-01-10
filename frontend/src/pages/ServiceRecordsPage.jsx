import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useServiceRecords } from '../hooks/useServiceRecords';
import ServiceRecordList from '../components/servicerecords/ServiceRecordList';
import ServiceRecordForm from '../components/servicerecords/ServiceRecordForm';

const ServiceRecordsPage = () => {
  // Hook must be called INSIDE the component function
  const {
    serviceRecords,
    vehicles,
    services,
    loading,
    error,
    fetchServiceRecords,
    fetchVehicles,
    fetchServices,
    createServiceRecord,
    updateServiceRecord,
    deleteServiceRecord,
    updateStatus
  } = useServiceRecords();

  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Debug: Check data structure
  useEffect(() => {
    console.log('=== DEBUG: Service Records Page ===');
    console.log('Total records:', serviceRecords.length);
    console.log('Records:', serviceRecords);
    console.log('Vehicles:', vehicles.length);
    console.log('Services:', services.length);
    console.log('Loading:', loading);
    console.log('Error:', error);

    if (serviceRecords.length > 0) {
      console.log('First Service Record:', serviceRecords[0]);
    }
  }, [serviceRecords, vehicles, services, loading, error]);

  // Manually fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      console.log('Loading service records data...');
      try {
        await fetchServiceRecords();
        await fetchVehicles();
        await fetchServices();
      } catch (err) {
        console.error('Error loading data:', err);
        showSnackbar('Failed to load data', 'error');
      }
    };

    loadData();
  }, [fetchServiceRecords, fetchVehicles, fetchServices]);

  const handleCreate = async (recordData) => {
    try {
      await createServiceRecord(recordData);
      setShowForm(false);
      showSnackbar('Service record created successfully!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to create service record', 'error');
    }
  };

  const handleUpdate = async (recordData) => {
    try {
      await updateServiceRecord(editingRecord.id, recordData);
      setEditingRecord(null);
      showSnackbar('Service record updated successfully!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to update service record', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteServiceRecord(id);
      showSnackbar('Service record deleted successfully!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete service record', 'error');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateStatus(id, status);
      showSnackbar('Status updated successfully!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Failed to update status', 'error');
    }
  };

  const handleEdit = (record) => {
    console.log('Editing record:', record);
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleViewVehicle = (record) => {
    // Get vehicleId from multiple possible locations
    const vehicleId = record.vehicleId || record.vehicle?.id;

    console.log('Viewing vehicle for record:', record);
    console.log('Extracted vehicleId:', vehicleId);

    if (!vehicleId) {
      console.warn('No vehicle ID found for record:', record);
      showSnackbar('This service record has no vehicle information', 'warning');
      return;
    }

    // Navigate to vehicle service records page
    window.location.href = `/vehicles/${vehicleId}/records`;
  };

  const handleRefresh = async () => {
    try {
      await fetchServiceRecords();
      await fetchVehicles();
      await fetchServices();
      showSnackbar('Data refreshed successfully!', 'success');
    } catch (err) {
      showSnackbar('Failed to refresh data', 'error');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRecord(null);
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
            Service Records
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>

            {!showForm && !editingRecord && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowForm(true)}
              >
                Add Service Record
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {(showForm || editingRecord) && (
        <Box sx={{ mb: 4 }}>
          <ServiceRecordForm
            record={editingRecord}
            vehicles={vehicles}
            services={services}
            onSubmit={editingRecord ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEditing={!!editingRecord}
          />
        </Box>
      )}

      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.default' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          All Service Records ({serviceRecords.length})
        </Typography>

        {error && !loading && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Button
              size="small"
              onClick={handleRefresh}
              sx={{ ml: 2 }}
            >
              Retry
            </Button>
          </Alert>
        )}

        {loading && serviceRecords.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Loading service records...</Typography>
          </Box>
        ) : (
          <ServiceRecordList
            records={serviceRecords}
            vehicles={vehicles}  // Pass vehicles
            services={services}// Pass services
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewVehicle={handleViewVehicle}
            loading={loading}
            error={error}
          />
        )}
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

export default ServiceRecordsPage;