// src/components/customers/CustomerList.jsx
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
  Avatar,
  Typography,
  Box,
  Tooltip,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  LocationOn as MapPinIcon,
  People as PeopleIcon
} from '@mui/icons-material';

const CustomerList = ({ customers, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
        <CircularProgress size={40} />
        <Typography color="textSecondary">Loading customer records...</Typography>
      </Box>
    );
  }

  if (customers.length === 0) {
    return (
      <Paper elevation={0} sx={{
        textAlign: 'center',
        py: 10,
        border: '1px dashed #ccc',
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.02)'
      }}>
        <PeopleIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>No Customers Found</Typography>
        <Typography variant="body2" color="textSecondary">Add your first customer to start tracking services</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact Info</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Address</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer.id}
              hover
              sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' } }}
            >
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)'
                    }}
                  >
                    {customer.name?.charAt(0).toUpperCase() || '?'}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="600" color="text.primary">
                      {customer.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {customer.id}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>

              <TableCell>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MailIcon fontSize="small" color="action" sx={{ fontSize: 16 }} />
                    <Typography variant="body2">{customer.email}</Typography>
                  </Box>
                  {customer.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" sx={{ fontSize: 16 }} />
                      <Typography variant="body2">{customer.phone}</Typography>
                    </Box>
                  )}
                </Stack>
              </TableCell>

              <TableCell>
                {customer.address ? (
                  <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                    <MapPinIcon fontSize="small" color="action" sx={{ fontSize: 16, mt: 0.3 }} />
                    <Typography variant="body2" sx={{ maxWidth: 250 }}>{customer.address}</Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.disabled" fontStyle="italic">Not provided</Typography>
                )}
              </TableCell>

              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="Edit Customer">
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(customer)}
                      size="small"
                      sx={{
                        backgroundColor: 'primary.light',
                        color: 'white',
                        '&:hover': { backgroundColor: 'primary.main' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Customer">
                    <IconButton
                      color="error"
                      onClick={() => onDelete(customer.id)}
                      size="small"
                      sx={{
                        backgroundColor: 'error.light',
                        color: 'white',
                        '&:hover': { backgroundColor: 'error.main' }
                      }}
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

export default CustomerList;
