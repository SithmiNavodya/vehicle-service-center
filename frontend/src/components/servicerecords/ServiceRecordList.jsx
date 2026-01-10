import React, { useEffect } from 'react';
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
  Tooltip,
  TablePagination
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  DirectionsCar as CarIcon,
  Build as ServiceIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const ServiceRecordList = ({
  records,
  vehicles,  // Add vehicles prop
  services,  // Add services prop
  onEdit,
  onDelete,
  onViewVehicle,
  loading,
  error
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Helper function to get vehicle details by vehicleId
  const getVehicleDetails = (vehicleId) => {
    if (!vehicleId || !vehicles || vehicles.length === 0) {
      return { vehicleNumber: 'N/A', brand: 'N/A', model: 'N/A' };
    }

    const vehicle = vehicles.find(v => v.id === vehicleId || v.vehicleId === vehicleId);
    if (!vehicle) {
      return { vehicleNumber: 'N/A', brand: 'N/A', model: 'N/A' };
    }

    return {
      vehicleNumber: vehicle.vehicleNumber || vehicle.number || 'N/A',
      brand: vehicle.brand || 'N/A',
      model: vehicle.model || 'N/A',
      vehicleObj: vehicle
    };
  };

  // Helper function to get service details by serviceId (if you have serviceId in records)
  const getServiceDetails = (serviceId) => {
    if (!serviceId || !services || services.length === 0) {
      return { serviceName: 'N/A', price: 'N/A' };
    }

    const service = services.find(s => s.id === serviceId);
    if (!service) {
      return { serviceName: 'N/A', price: 'N/A' };
    }

    return {
      serviceName: service.serviceName || service.name || 'N/A',
      price: service.price || 'N/A',
      serviceObj: service
    };
  };

  const getStatusChip = (status) => {
    switch(status?.toUpperCase()) {
      case 'COMPLETED':
        return <Chip icon={<CompletedIcon />} label="COMPLETED" color="success" size="small" />;
      case 'IN_PROGRESS':
        return <Chip label="IN PROGRESS" color="warning" size="small" />;
      case 'CANCELLED':
        return <Chip label="CANCELLED" color="error" size="small" />;
      default:
        return <Chip icon={<PendingIcon />} label="PENDING" color="info" size="small" />;
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A' || dateString === 'null') return 'N/A';
    try {
      // Check if dateString is already a Date object or timestamp
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'N/A';
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Debug
  useEffect(() => {
    console.log('=== ServiceRecordList Debug ===');
    console.log('Records:', records);
    console.log('Vehicles:', vehicles);
    console.log('Services:', services);
    if (records.length > 0 && vehicles.length > 0) {
      const firstRecord = records[0];
      const vehicleDetails = getVehicleDetails(firstRecord.vehicleId);
      console.log('First record vehicle details:', vehicleDetails);
    }
  }, [records, vehicles, services]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading service records...</Typography>
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

  if (!records || records.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="textSecondary">
          No service records found. Add your first service record!
        </Typography>
      </Box>
    );
  }

  // Get current page records
  const currentRecords = records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell><strong>Record ID</strong></TableCell>
              <TableCell><strong>Vehicle</strong></TableCell>
              <TableCell><strong>Service</strong></TableCell>
              <TableCell><strong>Service Date</strong></TableCell>
              <TableCell><strong>Next Service</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((record, index) => {
              // Get vehicle details
              const vehicleDetails = getVehicleDetails(record.vehicleId);

              // Get service details - assuming record has serviceId
              // If your records don't have serviceId, you may need to adjust this
              const serviceDetails = getServiceDetails(record.serviceId);

              // Get record ID
              const recordId = record.recordId || record.id || `REC-${record.id?.toString().slice(-4)}` || 'N/A';

              // Get service date and next service date
              // Check different possible property names
              const serviceDate = record.serviceDate || record.service_date || record.date;
              const nextServiceDate = record.nextServiceDate || record.next_service_date || record.nextDate;

              return (
                <TableRow
                  key={record.id || index}
                  hover
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell>
                    <Chip
                      label={recordId}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CarIcon fontSize="small" color="action" />
                      <Box>
                        <Typography fontWeight="medium">
                          {vehicleDetails.vehicleNumber}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {vehicleDetails.brand} {vehicleDetails.model}
                        </Typography>
                      </Box>
                      {record.vehicleId && (
                        <Tooltip title="View Vehicle Records">
                          <IconButton
                            size="small"
                            onClick={() => onViewVehicle(record)}
                            sx={{ ml: 1 }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ServiceIcon fontSize="small" color="action" />
                      <Box>
                        <Typography fontWeight="medium">
                          {serviceDetails.serviceName}
                        </Typography>
                        {serviceDetails.price && serviceDetails.price !== 'N/A' && (
                          <Typography variant="caption" color="textSecondary">
                            ${serviceDetails.price}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {formatDate(serviceDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {formatDate(nextServiceDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(record.status)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(record)}
                      title="Edit record"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete service record ${recordId}?`)) {
                          onDelete(record.id);
                        }
                      }}
                      title="Delete record"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={records.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default ServiceRecordList;