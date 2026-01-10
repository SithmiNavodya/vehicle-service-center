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
  CircularProgress
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
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
    fetchData();
  }, [vehicleId]);

  const fetchData = async () => {
    try {
      const vehicleData = await vehicleService.getVehicleById(vehicleId);
      setVehicle(vehicleData);

      const servicesData = await serviceRecordService.getAllServices();
      setServices(servicesData);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const recordData = {
        ...formData,
        vehicleId: parseInt(vehicleId)
      };

      await serviceRecordService.createServiceRecord(recordData);
      navigate(`/vehicles/${vehicleId}/records`);
    } catch (err) {
      setError(err.message || 'Failed to create record');
      setLoading(false);
    }
  };

  if (!vehicle) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate(`/vehicles/${vehicleId}/records`)}
        sx={{ mb: 3 }}
      >
        Back to Records
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Quick Add Service Record for {vehicle.vehicleNumber}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Service"
                value={formData.serviceId}
                onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                required
              >
                <MenuItem value="">Select Service</MenuItem>
                {services.map(service => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.serviceName} - ${service.price}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Service Date"
                type="date"
                value={formData.serviceDate}
                onChange={(e) => setFormData({...formData, serviceDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Next Service Date"
                type="date"
                value={formData.nextServiceDate}
                onChange={(e) => setFormData({...formData, nextServiceDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/vehicles/${vehicleId}/records`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Record'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default QuickAddServiceRecordPage;