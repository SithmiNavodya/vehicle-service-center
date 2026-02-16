// src/pages/QuickAddServiceRecordPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  Divider,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Build as ServiceIcon,
  DateRange as DateIcon,
  Notes as NotesIcon,
  NavigateNext as NavigateNextIcon,
  DirectionsCar as CarIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import serviceRecordService from '../services/serviceRecordService';
import vehicleService from '../services/vehicleService';

const QuickAddServiceRecordPage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: '',
    serviceDate: new Date().toISOString().split('T')[0],
    nextServiceDate: '',
    status: 'PENDING',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [v, s] = await Promise.all([
          vehicleService.getVehicleById(vehicleId),
          serviceRecordService.getAllServices()
        ]);
        setVehicle(v);
        setServices(s);
      } catch (err) {
        setError('Failed to synchronize telemetric data');
      }
    };
    fetchData();
  }, [vehicleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await serviceRecordService.createServiceRecord({
        ...formData,
        vehicleId: parseInt(vehicleId),
        totalAmount: services.find(s => s.id === Number(formData.serviceId))?.price || 0
      });
      navigate(`/vehicles/${vehicleId}/records`);
    } catch (err) {
      setError(err.message || 'Registration failure');
      setLoading(false);
    }
  };

  if (!vehicle && !error) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
          <Link underline="hover" color="inherit" href="/vehicles">Vehicles</Link>
          <Typography color="text.primary" fontWeight="500">Quick Log</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(`/vehicles/${vehicleId}/records`)} sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}><BackIcon /></IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold">Expedited Service Entry</Typography>
            <Typography variant="body2" color="textSecondary">Initiating maintenance log for asset <Typography component="span" fontWeight="bold" color="primary">{vehicle?.vehicleNumber}</Typography></Typography>
          </Box>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>OPERATIONAL SPECIFICATION</Typography>
                <TextField
                  select fullWidth label="Service Protocol" required
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><ServiceIcon color="primary" /></InputAdornment>,
                    sx: { borderRadius: 2 }
                  }}
                >
                  {services.map(s => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.serviceName} - Rs. {parseFloat(s.price).toLocaleString()}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth type="date" label="Execution Date" required
                  value={formData.serviceDate}
                  onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><DateIcon color="primary" /></InputAdornment>,
                    sx: { borderRadius: 2 }
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth type="date" label="Anticipated Recall"
                  value={formData.nextServiceDate}
                  onChange={(e) => setFormData({ ...formData, nextServiceDate: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><DateIcon color="secondary" /></InputAdornment>,
                    sx: { borderRadius: 2 }
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth multiline rows={3} label="Operational Findings / Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Record incident details or technical remarks..."
                  InputProps={{
                    startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><NotesIcon color="primary" /></InputAdornment>,
                    sx: { borderRadius: 3 }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
                  <Button
                    variant="outlined" onClick={() => navigate(`/vehicles/${vehicleId}/records`)}
                    sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 'bold' }}
                  >
                    Discard
                  </Button>
                  <Button
                    type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      borderRadius: 2, px: 6, textTransform: 'none', fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                    }}
                  >
                    {loading ? 'Registering...' : 'Confirm Entry'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default QuickAddServiceRecordPage;