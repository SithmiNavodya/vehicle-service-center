// src/pages/VehicleServiceRecordsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Link,
  Snackbar,
  Stack,
  Avatar,
  Tooltip,
  Dialog
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  DirectionsCar as CarIcon,
  CalendarToday as CalendarIcon,
  Build as ServiceIcon,
  Description as NotesIcon,
  NavigateNext as NavigateNextIcon,
  History as HistoryIcon,
  CheckCircle as DoneIcon,
  PendingActions as PendingIcon,
  AccountCircle as OwnerIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
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

  useEffect(() => {
    const loadVehicleData = async () => {
      if (!vehicleId) return;

      const vid = parseInt(vehicleId);
      console.log('[VehicleRecords] Loading data for vehicleId:', vid);

      // Try to find vehicle if list exists
      if (vehicles.length > 0) {
        const v = vehicles.find(x => x.id === vid);
        if (v) {
          console.log('[VehicleRecords] Found vehicle:', v);
          setVehicle(v);
        }
      }

      try {
        console.log('[VehicleRecords] Calling fetchServiceRecordsByVehicle...');
        const apiRecords = await fetchServiceRecordsByVehicle(vid);
        console.log('[VehicleRecords] API Records count:', apiRecords.length);

        let finalRecords = apiRecords;
        if (apiRecords.length === 0 && allRecords.length > 0) {
          console.log('[VehicleRecords] API returned empty, trying fallback from allRecords...');
          finalRecords = allRecords.filter(r => (Number(r.vehicleId) === vid || Number(r.vehicle?.id) === vid));
          console.log('[VehicleRecords] Fallback count:', finalRecords.length);
        }

        const enriched = finalRecords.map(r => {
          const s = services.find(sx => sx.id === r.serviceId);
          return {
            ...r,
            service: s,
            serviceName: s ? (s.serviceName || s.name) : (r.serviceName || 'Standard Service')
          };
        });
        setVehicleRecords(enriched);
      } catch (err) {
        console.error('[VehicleRecords] Error loading records:', err);
        // Fallback filter
        if (allRecords && allRecords.length > 0) {
          console.log('[VehicleRecords] Falling back to local filter');
          setVehicleRecords(allRecords.filter(r => (r.vehicleId === vid || r.vehicle?.id === vid)));
        }
      }
    };
    loadVehicleData();
  }, [vehicleId, vehicles, services, allRecords, fetchServiceRecordsByVehicle]);

  const getStatusConfig = (status) => {
    const s = status?.toUpperCase();
    if (s === 'COMPLETED') return { color: 'success', label: 'FULFILLED', icon: <DoneIcon fontSize="small" /> };
    if (s === 'IN_PROGRESS') return { color: 'warning', label: 'IN OPERATION', icon: <HistoryIcon fontSize="small" /> };
    if (s === 'CANCELLED') return { color: 'error', label: 'ARCHIVED', icon: null };
    return { color: 'info', label: 'QUEUED', icon: <PendingIcon fontSize="small" /> };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleCreate = async (data) => {
    try {
      await createServiceRecord({ ...data, vehicleId: parseInt(vehicleId) });
      setShowForm(false);
      showSnackbar('Operational record registered!', 'success');
      refreshLocalData();
    } catch (err) { showSnackbar(err.message, 'error'); }
  };

  const handleUpdate = async (data) => {
    try {
      await updateServiceRecord(editingRecord.id, data);
      setShowForm(false); setEditingRecord(null);
      showSnackbar('Audit updated!', 'success');
      refreshLocalData();
    } catch (err) { showSnackbar(err.message, 'error'); }
  };

  const refreshLocalData = async () => {
    const apiRecords = await fetchServiceRecordsByVehicle(parseInt(vehicleId));
    setVehicleRecords(apiRecords.map(r => ({
      ...r,
      service: services.find(s => s.id === r.serviceId),
      serviceName: services.find(s => s.id === r.serviceId)?.serviceName || 'Standard Service'
    })));
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Erase this operational record?')) {
      try {
        await deleteServiceRecord(id);
        showSnackbar('Record archived successfully', 'success');
        refreshLocalData();
      } catch (err) {
        showSnackbar(err.message || 'Deletion inhibited', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => setSnackbar({ open: true, message, severity });

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  if (!vehicle) return <Container sx={{ mt: 4 }}><Alert severity="warning">Telemetry stream unavailable</Alert></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
          <Link underline="hover" color="inherit" href="/vehicles">Vehicles</Link>
          <Typography color="text.primary" fontWeight="500">Service Audit</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton onClick={() => navigate('/vehicles')} color="primary" sx={{ bgcolor: 'rgba(25,118,210,0.05)' }}><BackIcon /></IconButton>
              <Box>
                <Typography variant="h3" fontWeight="bold">{vehicle.vehicleNumber}</Typography>
                <Typography variant="body1" color="textSecondary">{vehicle.brand} {vehicle.model} • {vehicle.vehicleType}</Typography>
              </Box>
            </Stack>
          </Box>
          <Button
            variant="contained" startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            sx={{
              borderRadius: 2, px: 4, py: 1.5, textTransform: 'none', fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
            }}
          >
            New Service Log
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, border: '1px solid #eee', height: '100%' }} elevation={0}>
            <CardContent>
              <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>ASSET METRICS</Typography>
              <Stack spacing={2.5} sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(25,118,210,0.1)', color: 'primary.main' }}><OwnerIcon /></Avatar>
                  <Box><Typography variant="caption" color="textSecondary">Assignee</Typography><Typography fontWeight="bold">{vehicle.customer?.name || '---'}</Typography></Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(76,175,80,0.1)', color: 'success.main' }}><HistoryIcon /></Avatar>
                  <Box><Typography variant="caption" color="textSecondary">Total Encounters</Typography><Typography fontWeight="bold">{vehicleRecords.length} Records</Typography></Box>
                </Box>
                <Divider />
                <Typography variant="caption" color="textSecondary">Telemetric overview for this specific vehicle asset based on historical operational data.</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {vehicleRecords.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed #ccc' }} elevation={0}>
                <HistoryIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                <Typography color="textSecondary">No operational logs found for this registry code.</Typography>
              </Paper>
            ) : vehicleRecords.map((record) => {
              const cfg = getStatusConfig(record.status);
              return (
                <Card key={record.id} sx={{ borderRadius: 3, border: '1px solid #eee', transition: '0.3s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.05)', transform: 'translateY(-2px)' } }} elevation={0}>
                  <CardContent sx={{ p: '24px !important' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="h6" fontWeight="bold">{record.serviceName}</Typography>
                          <Chip label={cfg.label} color={cfg.color} size="small" icon={cfg.icon} sx={{ fontWeight: 'bold' }} />
                        </Stack>
                        <Typography variant="caption" color="primary" fontWeight="bold">#{record.recordId || `SR-${record.id}`}</Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" variant="outlined" onClick={() => { setEditingRecord(record); setShowForm(true); }} sx={{ border: '1px solid #eee' }}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteRecord(record.id)} sx={{ border: '1px solid #eee' }}><DeleteIcon fontSize="small" /></IconButton>
                      </Stack>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}><Typography variant="caption" color="textSecondary" display="block">EXECUTION DATE</Typography><Typography variant="body2" fontWeight="500">{formatDate(record.serviceDate)}</Typography></Grid>
                      <Grid item xs={6} md={3}><Typography variant="caption" color="textSecondary" display="block">NEXT RECALL</Typography><Typography variant="body2" fontWeight="bold" color="primary.main">{formatDate(record.nextServiceDate)}</Typography></Grid>
                      <Grid item xs={6} md={3}><Typography variant="caption" color="textSecondary" display="block">UNIT VALUE</Typography><Typography variant="body2" fontWeight="bold" color="success.main">Rs. {parseFloat(record.totalAmount || record.service?.price || 0).toLocaleString()}</Typography></Grid>
                      <Grid item xs={6} md={3}><Typography variant="caption" color="textSecondary" display="block">ASSET TAG</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CarIcon sx={{ fontSize: 14, color: '#666' }} /><Typography variant="caption" fontWeight="bold">{vehicle.vehicleNumber}</Typography></Box></Grid>
                    </Grid>
                    {record.notes && (
                      <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, display: 'flex', gap: 1.5 }}>
                        <NotesIcon sx={{ fontSize: 18, color: '#999', mt: 0.5 }} />
                        <Typography variant="body2" color="textSecondary">{record.notes}</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Grid>
      </Grid>

      {/* Form Dialog */}
      <Dialog open={showForm} onClose={() => { setShowForm(false); setEditingRecord(null); }} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <ServiceRecordForm record={editingRecord} vehicles={[vehicle]} services={services} onSubmit={editingRecord ? handleUpdate : handleCreate} onCancel={() => { setShowForm(false); setEditingRecord(null); }} isEditing={!!editingRecord} />
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default VehicleServiceRecordsPage;