// src/components/vehicles/VehicleList.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip,
  Stack,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  ErrorOutline as ErrorIcon
} from '@mui/icons-material';

const VehicleList = ({ vehicles, onEdit, onDelete, onViewRecords, loading, error }) => {
  console.log('[VehicleList] Rendering with data:', vehicles);
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
        <CircularProgress size={40} />
        <Typography color="textSecondary">Fetching vehicle fleet data...</Typography>
      </Box>
    );
  }

  if (vehicles.length === 0) {
    return (
      <Paper elevation={0} sx={{
        textAlign: 'center',
        py: 10,
        border: '1px dashed #ccc',
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.02)'
      }}>
        <CarIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>No Vehicles Registered</Typography>
        <Typography variant="body2" color="textSecondary">Start by adding a vehicle to your management system</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reference</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vehicle Number</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Model Info</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Owner</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow
              key={vehicle.id}
              hover
              sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' } }}
            >
              <TableCell>
                <Chip
                  label={`V_${(vehicle.vehicleId || vehicle.id).toString().replace(/^V[-_]/, '')}`}
                  size="small"
                  sx={{
                    fontWeight: 'bold',
                    borderRadius: 1,
                    backgroundColor: 'primary.light',
                    color: 'white'
                  }}
                />
              </TableCell>

              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                  {vehicle.vehicleNumber}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2" fontWeight="500">
                  {vehicle.brand} {vehicle.model}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Reg: {vehicle.registrationYear || 'N/A'}
                </Typography>
              </TableCell>

              <TableCell>
                <Chip
                  label={vehicle.vehicleType}
                  variant="outlined"
                  size="small"
                  icon={<CarIcon sx={{ fontSize: '1rem !important' }} />}
                  sx={{ borderRadius: 1.5, fontWeight: 500 }}
                />
              </TableCell>

              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'secondary.main' }}>
                    {vehicle.customerName?.charAt(0) || vehicle.customer?.name?.charAt(0) || '?'}
                  </Avatar>
                  <Typography variant="body2">
                    {vehicle.customerName || vehicle.customer?.name || 'Unknown'}
                  </Typography>
                </Stack>
              </TableCell>

              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="Service History">
                    <IconButton
                      color="info"
                      onClick={() => onViewRecords(vehicle.id)}
                      size="small"
                      sx={{ backgroundColor: 'info.light', color: 'white', '&:hover': { backgroundColor: 'info.main' } }}
                    >
                      <HistoryIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Specifications">
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(vehicle)}
                      size="small"
                      sx={{ backgroundColor: 'primary.light', color: 'white', '&:hover': { backgroundColor: 'primary.main' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Portfolio">
                    <IconButton
                      color="error"
                      onClick={() => {
                        if (window.confirm(`Permanently delete records for "${vehicle.vehicleNumber}"?`)) {
                          onDelete(vehicle.id);
                        }
                      }}
                      size="small"
                      sx={{ backgroundColor: 'error.light', color: 'white', '&:hover': { backgroundColor: 'error.main' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VehicleList;
