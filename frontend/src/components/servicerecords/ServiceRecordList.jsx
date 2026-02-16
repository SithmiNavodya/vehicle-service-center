// src/components/servicerecords/ServiceRecordList.jsx
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
  Avatar,
  Divider,
  Tooltip,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  DirectionsCar as CarIcon,
  Build as ServiceIcon,
  History as HistoryIcon,
  Payments as MoneyIcon,
  EventNote as DateIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const ServiceRecordList = ({
  records,
  vehicles,
  services,
  onEdit,
  onDelete,
  onViewVehicle,
  loading,
  error
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);

  const getVehicleDetails = (vehicleId) => {
    if (!vehicleId || !vehicles) return { vehicleNumber: 'N/A', brand: '---', model: '---' };
    const v = vehicles.find(v => v.id === vehicleId || v.vehicleId === vehicleId);
    return v ? {
      vehicleNumber: v.vehicleNumber || v.number || 'N/A',
      brand: v.brand || '---',
      model: v.model || '---'
    } : { vehicleNumber: 'N/A', brand: '---', model: '---' };
  };

  const getServiceDetails = (serviceId) => {
    if (!serviceId || !services) return { serviceName: 'General Maintenance', price: 0 };
    const s = services.find(s => s.id === serviceId);
    return s ? { serviceName: s.serviceName || '---', price: s.price || 0 } : { serviceName: '---', price: 0 };
  };

  const getStatusConfig = (status) => {
    const s = status?.toUpperCase();
    const configs = {
      'COMPLETED': { color: 'success', icon: <CompletedIcon fontSize="small" />, label: 'FULFILLED', bg: 'rgba(76, 175, 80, 0.1)' },
      'IN_PROGRESS': { color: 'warning', icon: <HistoryIcon fontSize="small" />, label: 'IN OPERATION', bg: 'rgba(255, 152, 0, 0.1)' },
      'CANCELLED': { color: 'error', icon: null, label: 'ARCHIVED', bg: 'rgba(244, 67, 54, 0.1)' },
      'PENDING': { color: 'info', icon: <PendingIcon fontSize="small" />, label: 'QUEUED', bg: 'rgba(33, 150, 243, 0.1)' }
    };
    return configs[s] || configs['PENDING'];
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return '---';
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? '---' : format(d, 'MMM dd, yyyy');
    } catch { return '---'; }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, gap: 2, alignItems: 'center' }}>
      <CircularProgress size={24} />
      <Typography color="textSecondary" fontWeight="500">Retrieving operational logs...</Typography>
    </Box>
  );

  if (!records || records.length === 0) return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography color="textSecondary" variant="h6">No Service History Detected</Typography>
      <Typography variant="body2" color="textSecondary">Initiate a new service log to begin tracking metadata.</Typography>
    </Box>
  );

  const displayedRecords = records.slice(0, (page + 1) * rowsPerPage);

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={3}>
        {displayedRecords.map((record) => {
          const vd = getVehicleDetails(record.vehicleId);
          const sd = getServiceDetails(record.serviceId);
          const rid = record.recordId || `SR-${record.id.toString().padStart(4, '0')}`;
          const sc = getStatusConfig(record.status);

          return (
            <Grid item xs={12} md={6} lg={4} key={record.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid #eef2f6',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
                    borderColor: 'primary.light'
                  }
                }}
              >
                <Box sx={{ p: 2.5, pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={rid}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        borderRadius: 1.5,
                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        color: 'primary.main',
                        fontSize: '0.7rem',
                        border: '1px solid rgba(25, 118, 210, 0.2)'
                      }}
                    />
                    <Chip
                      label={sc.label}
                      size="small"
                      icon={React.cloneElement(sc.icon, { sx: { color: 'inherit', fontSize: '1rem' } })}
                      sx={{
                        borderRadius: 1.5,
                        fontWeight: 800,
                        fontSize: '0.65rem',
                        backgroundColor: sc.bg,
                        color: `${sc.color}.main`,
                        border: `1px solid rgba(0,0,0,0.05)`
                      }}
                    />
                  </Box>

                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(25,118,210,0.1)', color: 'primary.main', width: 48, height: 48 }}>
                      <ServiceIcon fontSize="medium" />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="800" noWrap sx={{ maxWidth: 200 }}>
                        {sd.serviceName}
                      </Typography>
                      <Typography variant="caption" color="success.main" fontWeight="800">
                        Rs. {parseFloat(sd.price).toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 1.5, opacity: 0.6 }} />

                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(25,118,210,0.05)', color: 'primary.main' }}>
                        <CarIcon sx={{ fontSize: '1rem' }} />
                      </Avatar>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" fontWeight="700">{vd.vehicleNumber}</Typography>
                          <IconButton size="small" onClick={() => onViewVehicle(record)} sx={{ p: 0.2 }}>
                            <ViewIcon sx={{ fontSize: '1rem' }} color="primary" />
                          </IconButton>
                        </Stack>
                        <Typography variant="caption" color="textSecondary">{vd.brand} {vd.model}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(251, 140, 0, 0.05)', color: '#fb8c00' }}>
                        <DateIcon sx={{ fontSize: '1rem' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">Service Date</Typography>
                        <Typography variant="body2" fontWeight="700">{formatDate(record.serviceDate)}</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ mt: 'auto', p: 2, pt: 1, backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      fullWidth
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => onEdit(record)}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                    >
                      Audit
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => { if (window.confirm('Delete operational record?')) onDelete(record.id); }}
                      sx={{ borderRadius: 2, border: '1px solid', borderColor: 'error.light' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {records.length > displayedRecords.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setPage(p => p + 1)}
            sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
          >
            Load More Records
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ServiceRecordList;