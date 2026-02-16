// src/components/spareparts/SparePartList.jsx
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
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Category as CategoryIcon,
  Build as PartIcon
} from '@mui/icons-material';

const SparePartList = ({ spareParts, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
        <CircularProgress size={40} />
        <Typography color="textSecondary">Synchronizing inventory telemetry...</Typography>
      </Box>
    );
  }

  if (spareParts.length === 0) {
    return (
      <Paper elevation={0} sx={{
        textAlign: 'center',
        py: 10,
        border: '1px dashed #ccc',
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.02)'
      }}>
        <InventoryIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>Empty Inventory Registry</Typography>
        <Typography variant="body2" color="textSecondary">No operational units match your current filter parameters</Typography>
      </Paper>
    );
  }

  const getStockStatus = (quantity, minQuantity) => {
    if (quantity <= 0) return { label: 'STOCK OUT', color: 'error', value: 0 };
    if (quantity <= minQuantity) return { label: 'CRITICAL', color: 'error', value: 30 };
    if (quantity <= minQuantity * 1.5) return { label: 'REORDER', color: 'warning', value: 60 };
    return { label: 'STABLE', color: 'success', value: 100 };
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #eef2f6', overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)' }}>
            <TableCell sx={{ color: 'white', fontWeight: '800', py: 2.5 }}>REGISTRY ID</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: '800', py: 2.5 }}>ASSET SPECIFICATION</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: '800', py: 2.5 }}>TAXONOMY</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: '800', py: 2.5 }}>STOCK VOLUME</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: '800', py: 2.5 }}>VALUATION</TableCell>
            <TableCell align="center" sx={{ color: 'white', fontWeight: '800', py: 2.5 }}>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {spareParts.map((part) => {
            const status = getStockStatus(part.quantity, part.minQuantity);
            return (
              <TableRow
                key={part.id}
                hover
                sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' } }}
              >
                <TableCell>
                  <Chip
                    label={part.partCode}
                    size="small"
                    sx={{
                      fontWeight: '800',
                      borderRadius: 1.5,
                      backgroundColor: status.color === 'error' ? 'error.light' : 'primary.light',
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(25,118,210,0.1)', color: 'primary.main', width: 40, height: 40 }}>
                      <PartIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="800">
                        {part.partName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" fontWeight="600">
                        {part.brand} • {part.model}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'rgba(0,0,0,0.05)', color: 'text.secondary' }}>
                      <CategoryIcon sx={{ fontSize: '0.9rem' }} />
                    </Avatar>
                    <Typography variant="body2" fontWeight="600">
                      {part.category?.categoryName || 'Universal'}
                    </Typography>
                  </Stack>
                </TableCell>

                <TableCell sx={{ width: 180 }}>
                  <Box sx={{ minWidth: 120 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight="800" color={status.color === 'error' ? 'error.main' : 'text.primary'}>
                        {part.quantity} Units
                      </Typography>
                      <Typography variant="caption" color="textSecondary" fontWeight="600">
                        LMT: {part.minQuantity}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((part.quantity / (part.minQuantity * 2 || 1)) * 100, 100)}
                      color={status.color}
                      sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.05)' }}
                    />
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" fontWeight="800" color="success.main">
                    Rs. {part.price?.toLocaleString()}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Update Metrics">
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(part)}
                        size="small"
                        sx={{
                          borderRadius: 1.5,
                          bgcolor: 'rgba(25,118,210,0.1)',
                          '&:hover': { bgcolor: 'primary.main', color: 'white' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Decommission Item">
                      <IconButton
                        color="error"
                        onClick={() => {
                          if (window.confirm(`Permanently remove operational unit "${part.partName}"?`)) {
                            onDelete(part.id);
                          }
                        }}
                        size="small"
                        sx={{
                          borderRadius: 1.5,
                          bgcolor: 'rgba(211,47,47,0.1)',
                          '&:hover': { bgcolor: 'error.main', color: 'white' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SparePartList;
