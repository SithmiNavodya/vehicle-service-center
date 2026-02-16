// src/pages/ServiceRecordsPage.jsx
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
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  NavigateNext as NavigateNextIcon,
  Assignment as RecordIcon,
  CheckCircle as DoneIcon,
  PendingActions as PendingIcon,
  QueryStats as StatsIcon
} from '@mui/icons-material';
import { useServiceRecords } from '../hooks/useServiceRecords';
import ServiceRecordList from '../components/servicerecords/ServiceRecordList';
import ServiceRecordForm from '../components/servicerecords/ServiceRecordForm';

const ServiceRecordsPage = () => {
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
    deleteServiceRecord
  } = useServiceRecords();

  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchServiceRecords();
        await fetchVehicles();
        await fetchServices();
      } catch (err) {
        showSnackbar('Failed to load operational data', 'error');
      }
    };
    loadData();
  }, [fetchServiceRecords, fetchVehicles, fetchServices]);

  const handleCreate = async (recordData) => {
    try {
      await createServiceRecord(recordData);
      setShowForm(false);
      showSnackbar('Operational record registered!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Registration failed', 'error');
    }
  };

  const handleUpdate = async (recordData) => {
    try {
      await updateServiceRecord(editingRecord.id, recordData);
      setEditingRecord(null);
      setShowForm(false);
      showSnackbar('Record audit completed!', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Update failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteServiceRecord(id);
      showSnackbar('Record archived successfully', 'success');
    } catch (err) {
      showSnackbar(err.message || 'Deletion inhibited', 'error');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleViewVehicle = (record) => {
    const vehicleId = record.vehicleId || record.vehicle?.id;
    if (!vehicleId) {
      showSnackbar('No vehicle telemetry linked', 'warning');
      return;
    }
    window.location.href = `/vehicles/${vehicleId}/records`;
  };

  const handleRefresh = async () => {
    try {
      await fetchServiceRecords();
      showSnackbar('Data synchronization successful!', 'success');
    } catch (err) {
      showSnackbar('Sync failed', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const StatCard = ({ title, value, icon, color, bg }) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        background: bg,
        color: color,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.03)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, transform: 'rotate(15deg)', color: color }}>
          {React.cloneElement(icon, { sx: { fontSize: 80 } })}
        </Box>

        <Stack spacing={0.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {React.cloneElement(icon, { sx: { fontSize: 24 } })}
            <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', mt: -0.5 }}>
            {value}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
          <Typography color="primary.main" fontWeight="500">Operations</Typography>
          <Typography color="text.primary" fontWeight="500">Service Logs</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <RecordIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              Service Execution Hub
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Comprehensive audit trail and tracking for all maintenance activities
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}
              sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 'bold' }}
            >
              Sync Records
            </Button>
            <Button
              variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm(true)}
              sx={{
                borderRadius: 2, px: 4, py: 1.5, textTransform: 'none', fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
            >
              Log New Service
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Stats Dashboard */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Tickets" value={serviceRecords.length} icon={<StatsIcon />} color="#1976d2" bg="linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Pending" value={serviceRecords.filter(r => r.status === 'PENDING').length} icon={<PendingIcon />} color="#ed6c02" bg="linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Fulfilled" value={serviceRecords.filter(r => r.status === 'COMPLETED').length} icon={<DoneIcon />} color="#2e7d32" bg="linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Archived" value={serviceRecords.filter(r => r.status === 'CANCELLED').length} icon={<RecordIcon />} color="#607d8b" bg="linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%)" />
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Main List Wrapped in high-fidelity Container */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #eee', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.04)', borderBottom: '1px solid #eee' }}>
          <Typography variant="subtitle1" fontWeight="800">Operational Log Repository</Typography>
        </Box>
        <ServiceRecordList
          records={serviceRecords}
          vehicles={vehicles}
          services={services}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewVehicle={handleViewVehicle}
          loading={loading}
          error={error}
        />
      </Paper>

      <Dialog
        open={showForm || !!editingRecord}
        onClose={() => { setShowForm(false); setEditingRecord(null); }}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <ServiceRecordForm
          record={editingRecord}
          vehicles={vehicles}
          services={services}
          onSubmit={editingRecord ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingRecord(null); }}
          isEditing={!!editingRecord}
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

export default ServiceRecordsPage;