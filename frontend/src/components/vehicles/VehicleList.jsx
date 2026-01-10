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
  Alert,
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  History as HistoryIcon // Add this import
} from '@mui/icons-material';

const VehicleList = ({ vehicles, onEdit, onDelete, onViewRecords, loading, error }) => {
  // ... existing code ...

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.light' }}>
            <TableCell><strong>Vehicle ID</strong></TableCell>
            <TableCell><strong>Vehicle Number</strong></TableCell>
            <TableCell><strong>Brand & Model</strong></TableCell>
            <TableCell><strong>Type</strong></TableCell>
            <TableCell><strong>Owner</strong></TableCell>
            <TableCell align="center"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id} hover>
              <TableCell>
                <Chip label={vehicle.vehicleId} color="primary" size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                <Typography fontWeight="medium">
                  {vehicle.vehicleNumber}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="medium">
                  {vehicle.brand} {vehicle.model}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip label={vehicle.vehicleType} color="secondary" size="small" icon={<CarIcon fontSize="small" />} />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {vehicle.customer?.name || 'Unknown'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center">
                {/* Add View Records button */}
                <IconButton
                  color="info"
                  onClick={() => onViewRecords(vehicle.id)}
                  title="View Service Records"
                  size="small"
                >
                  <HistoryIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => onEdit(vehicle)}
                  title="Edit vehicle"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    if (window.confirm(`Delete "${vehicle.vehicleNumber}"?`)) {
                      onDelete(vehicle.id);
                    }
                  }}
                  title="Delete vehicle"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VehicleList;