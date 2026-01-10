import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Breadcrumbs,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  DirectionsCar as CarIcon,
  CalendarToday as CalendarIcon,
  Build as ServiceIcon,
  Description as NotesIcon,
  Home as HomeIcon,
  List as ListIcon
} from '@mui/icons-material';
import { useServiceRecords } from '../hooks/useServiceRecords';
import ServiceRecordForm from '../components/servicerecords/ServiceRecordForm';

const VehicleServiceRecordsPage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const {
    serviceRecords: allRecords,
    vehicles,
    services,
    loading,
    error,
    fetchServiceRecordsByVehicle,
    createServiceRecord,
    updateServiceRecord,
    deleteServiceRecord
  } = useServiceRecords();

  const [vehicle, setVehicle] = useState(null);
  const [vehicleRecords, setVehicleRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load vehicle and its records
  useEffect(() => {
    const loadVehicleData = async () => {
      if (!vehicleId) return;

      try {
        console.log('🚗 Loading vehicle data for ID:', vehicleId);

        // 1. Find the vehicle
        const vehicleIdNum = parseInt(vehicleId);
        const foundVehicle = vehicles.find(v => v.id === vehicleIdNum);
        console.log('✅ Found vehicle:', foundVehicle);
        setVehicle(foundVehicle);

        if (!foundVehicle) {
          console.warn(`⚠️ Vehicle ${vehicleId} not found in vehicles list`);
          return;
        }

        // 2. Fetch records from API for this vehicle
        let apiRecords = [];
        try {
          console.log('📡 Fetching records from API...');
          apiRecords = await fetchServiceRecordsByVehicle(vehicleIdNum);
          console.log('✅ API records:', apiRecords);
        } catch (apiError) {
          console.error('❌ API fetch error:', apiError);
          // Fallback: filter from allRecords
          apiRecords = allRecords.filter(record =>
            record.vehicleId === vehicleIdNum ||
            (record.vehicle && record.vehicle.id === vehicleIdNum)
          );
          console.log('🔄 Using filtered records:', apiRecords);
        }

        // 3. CRITICAL: Enrich records with service data
        const enrichedRecords = apiRecords.map(record => {
          // Find service by serviceId
          const service = services.find(s =>
            s.id === record.serviceId ||
            s.id === (record.service ? record.service.id : null)
          );

          console.log(`📝 Record ${record.id} - serviceId: ${record.serviceId}, Found service:`, service);

          return {
            ...record,
            service: service || null,
            serviceName: service ? (service.serviceName || service.name) : 'Unknown Service',
            servicePrice: service ? service.price : null
          };
        });

        console.log('🎉 Enriched vehicle records:', enrichedRecords);
        setVehicleRecords(enrichedRecords);

      } catch (error) {
        console.error('💥 Error loading vehicle data:', error);
      }
    };

    if (vehicleId && vehicles.length > 0 && services.length > 0) {
      loadVehicleData();
    }
  }, [vehicleId, vehicles, services, allRecords, fetchServiceRecordsByVehicle]);

  // Helper function to get service details
  const getServiceDetails = (serviceId) => {
    if (!serviceId || !services || services.length === 0) {
      return { serviceName: 'Unknown Service', price: 'N/A' };
    }

    const service = services.find(s => s.id === serviceId);
    if (!service) {
      return { serviceName: 'Unknown Service', price: 'N/A' };
    }

    return {
      serviceName: service.serviceName || service.name || 'Unknown Service',
      price: service.price || 'N/A',
      serviceId: service.serviceId || service.id
    };
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'info';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleCreate = async (recordData) => {
    try {
      await createServiceRecord({
        ...recordData,
        vehicleId: parseInt(vehicleId)
      });
      setShowForm(false);
      showSnackbar('Service record created successfully!', 'success');

      // Refresh data
      const apiRecords = await fetchServiceRecordsByVehicle(parseInt(vehicleId));
      const enrichedRecords = apiRecords.map(record => {
        const service = services.find(s => s.id === record.serviceId);
        return {
          ...record,
          service: service || null,
          serviceName: service ? (service.serviceName || service.name) : 'Unknown Service'
        };
      });
      setVehicleRecords(enrichedRecords);

    } catch (err) {
      showSnackbar(err.message || 'Failed to create service record', 'error');
    }
  };

  const handleUpdate = async (recordData) => {
    try {
      await updateServiceRecord(editingRecord.id, recordData);
      setEditingRecord(null);
      setShowForm(false);
      showSnackbar('Service record updated successfully!', 'success');

      // Refresh data
      const apiRecords = await fetchServiceRecordsByVehicle(parseInt(vehicleId));
      const enrichedRecords = apiRecords.map(record => {
        const service = services.find(s => s.id === record.serviceId);
        return {
          ...record,
          service: service || null,
          serviceName: service ? (service.serviceName || service.name) : 'Unknown Service'
        };
      });
      setVehicleRecords(enrichedRecords);

    } catch (err) {
      showSnackbar(err.message || 'Failed to update service record', 'error');
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      try {
        await deleteServiceRecord(recordId);
        setVehicleRecords(prev => prev.filter(record => record.id !== recordId));
        showSnackbar('Service record deleted successfully!', 'success');
      } catch (err) {
        alert('Failed to delete record: ' + err.message);
      }
    }
  };

  const handleEditRecord = (record) => {
    console.log('Editing record:', record);
    setEditingRecord(record);
    setShowForm(true);
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

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/vehicles')}
        >
          Back to Vehicles
        </Button>
      </Container>
    );
  }

  if (!vehicle) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">
          Vehicle not found
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/vehicles')}
        >
          Back to Vehicles
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Home
        </Link>
        <Link to="/vehicles" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <ListIcon fontSize="small" sx={{ mr: 0.5 }} />
          Vehicles
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <CarIcon fontSize="small" sx={{ mr: 0.5 }} />
          Service Records
        </Typography>
      </Breadcrumbs>

      {/* Vehicle Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/vehicles')} color="primary">
              <BackIcon />
            </IconButton>
            <CarIcon fontSize="large" color="primary" />
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {vehicle.vehicleNumber}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {vehicle.brand} {vehicle.model} • {vehicle.vehicleType || 'Vehicle'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Vehicle ID: {vehicle.id} • Owner: {vehicle.customer?.name || 'Unknown'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="textSecondary">
              Total Service Records
            </Typography>
            <Typography variant="h3" color="primary">
              {vehicleRecords.length}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Service History
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setShowForm(true)}
            >
              Add Service Record
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Form for adding/editing records */}
      {(showForm || editingRecord) && (
        <Box sx={{ mb: 4 }}>
          <ServiceRecordForm
            record={editingRecord}
            vehicles={[vehicle]}
            services={services}
            onSubmit={editingRecord ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEditing={!!editingRecord}
          />
        </Box>
      )}

      {/* Service Records Cards */}
      {!showForm && !editingRecord && (
        <>
          {vehicleRecords.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              No service records found for this vehicle. Add your first service record!
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {vehicleRecords.map((record) => {
                const serviceDetails = getServiceDetails(record.serviceId);

                return (
                  <Grid item xs={12} key={record.id}>
                    <Card
                      elevation={2}
                      sx={{
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6
                        }
                      }}
                    >
                      <CardContent>
                        {/* Record Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {serviceDetails.serviceName}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                              <Chip
                                label={record.recordId || `Record-${record.id}`}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                              <Chip
                                label={record.status || 'PENDING'}
                                color={getStatusColor(record.status)}
                                size="small"
                              />
                              {serviceDetails.price !== 'N/A' && (
                                <Chip
                                  label={`$${parseFloat(serviceDetails.price).toFixed(2)}`}
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleEditRecord(record)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteRecord(record.id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>

                        {/* Service Details */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <CalendarIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                <strong>Service Date:</strong> {formatDate(record.serviceDate)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <CalendarIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                <strong>Next Service:</strong> {formatDate(record.nextServiceDate)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <ServiceIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                <strong>Service ID:</strong> {serviceDetails.serviceId || record.serviceId || 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <CarIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                <strong>Vehicle:</strong> {vehicle.vehicleNumber}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Notes Section */}
                        {record.notes && (
                          <>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <NotesIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                              <Box>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                  Notes:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {record.notes}
                                </Typography>
                              </Box>
                            </Box>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* Statistics Card */}
          {vehicleRecords.length > 0 && (
            <Paper elevation={1} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Service Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {vehicleRecords.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Records
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {vehicleRecords.filter(r => r.status?.toUpperCase() === 'COMPLETED').length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Completed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {vehicleRecords.filter(r => r.status?.toUpperCase() === 'PENDING').length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Pending
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {new Set(vehicleRecords.map(r => r.serviceId)).size}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Unique Services
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
        </>
      )}

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

export default VehicleServiceRecordsPage;