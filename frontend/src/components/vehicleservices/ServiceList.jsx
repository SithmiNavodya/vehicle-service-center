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
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const ServiceList = ({ services, onEdit, onDelete, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading services...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (services.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="textSecondary">
          No services found. Add your first service!
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.light' }}>
            <TableCell><strong>Service ID</strong></TableCell>
            <TableCell><strong>Service Name</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Price</strong></TableCell>
            <TableCell><strong>Estimated Time</strong></TableCell>
            <TableCell align="center"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.map((service) => (
            <TableRow
              key={service.id}
              hover
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <TableCell>
                <Chip
                  label={service.serviceId}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Typography fontWeight="medium">
                  {service.serviceName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="textSecondary" noWrap sx={{ maxWidth: 200 }}>
                  {service.description || 'No description'}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MoneyIcon color="success" fontSize="small" />
                  <Typography fontWeight="bold" color="success.main">
                    ${parseFloat(service.price).toFixed(2)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon color="action" fontSize="small" />
                  <Typography>{service.estimatedTime}</Typography>
                </Box>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="primary"
                  onClick={() => onEdit(service)}
                  title="Edit service"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${service.serviceName}"?`)) {
                      onDelete(service.id);
                    }
                  }}
                  title="Delete service"
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

export default ServiceList;