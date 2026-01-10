// src/pages/Inventory/SparePartsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Paper,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { sparePartService } from '../../services/sparePartService';
//import sparePartService from '../../services/sparePartService';
import SparePartForm from '../../components/spareparts/SparePartForm';
import SparePartList from '../../components/spareparts/SparePartList'; // Add this import

const SparePartsPage = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState(null);
  const [filter, setFilter] = useState('all'); // all, low-stock, in-stock

  // Fetch spare parts
  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      const data = await sparePartService.getAllSpareParts();
      setSpareParts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load spare parts. Please check if backend is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpareParts();
  }, []);

  // Filter spare parts based on selection
  const filteredParts = spareParts.filter(part => {
    if (filter === 'low-stock') {
      return part.quantity <= part.minQuantity;
    } else if (filter === 'in-stock') {
      return part.quantity > part.minQuantity;
    }
    return true;
  });

  // Search functionality
  const searchedParts = filteredParts.filter(part => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      part.partCode?.toLowerCase().includes(term) ||
      part.partName?.toLowerCase().includes(term) ||
      part.brand?.toLowerCase().includes(term) ||
      part.model?.toLowerCase().includes(term)
    );
  });

  const handleSearch = () => {
    // Search is handled in the filter above
  };

 const handleCreate = async (partData) => {
   try {
     console.log('Creating part with data:', partData);

     // Try different formats if one doesn't work
     const response = await sparePartService.createSparePart(partData);

     if (response) {
       setShowForm(false);
       showSnackbar('Spare part created successfully!', 'success');
       fetchSpareParts();
     }
   } catch (err) {
     console.error('Create error:', err);
     const errorMessage = err.message || 'Failed to create spare part. Please check backend connection.';
     showSnackbar(errorMessage, 'error');
   }
 };

  const handleUpdate = async (partData) => {
    try {
      console.log('Updating part:', editingPart.id, 'with data:', partData);

      const response = await sparePartService.updateSparePart(editingPart.id, partData);

      if (response) {
        setEditingPart(null);
        showSnackbar('Spare part updated successfully!', 'success');
        fetchSpareParts();
      }
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.message || 'Failed to update spare part.';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting part:', id);

      const response = await sparePartService.deleteSparePart(id);

      if (response) {
        showSnackbar('Spare part deleted successfully!', 'success');
        fetchSpareParts();
      }
    } catch (err) {
      console.error('Delete error:', err);
      const errorMessage = err.message || 'Failed to delete spare part. It might be in use.';
      showSnackbar(errorMessage, 'error');
    }
  };

  // Calculate stats
  const stats = {
    total: spareParts.length,
    lowStock: spareParts.filter(p => p.quantity <= p.minQuantity).length,
    totalValue: spareParts.reduce((sum, p) => sum + (p.price * p.quantity), 0)
  };

  // For snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Spare Parts Inventory
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            Add Spare Part
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h4">{stats.total}</Typography>
              <Typography variant="body2" color="textSecondary">Total Items</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h4" color="error.main">{stats.lowStock}</Typography>
              <Typography variant="body2" color="textSecondary">Low Stock Items</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h4" color="primary.main">
                Rs. {stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Typography>
              <Typography variant="body2" color="textSecondary">Total Inventory Value</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Search and Filter Bar */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by part code, name, brand, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1, minWidth: '300px' }}
            />

            {/* Filter Chips */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label="All"
                onClick={() => setFilter('all')}
                color={filter === 'all' ? 'primary' : 'default'}
                variant={filter === 'all' ? 'filled' : 'outlined'}
              />
              <Chip
                label="Low Stock"
                onClick={() => setFilter('low-stock')}
                color={filter === 'low-stock' ? 'error' : 'default'}
                variant={filter === 'low-stock' ? 'filled' : 'outlined'}
              />
              <Chip
                label="In Stock"
                onClick={() => setFilter('in-stock')}
                color={filter === 'in-stock' ? 'success' : 'default'}
                variant={filter === 'in-stock' ? 'filled' : 'outlined'}
              />
            </Box>

            <IconButton onClick={fetchSpareParts} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button
            size="small"
            onClick={fetchSpareParts}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      )}

      {/* Use SparePartList Component */}
      <SparePartList
        spareParts={searchedParts}
        onEdit={(part) => setEditingPart(part)}
        onDelete={(id) => {
          const part = spareParts.find(p => p.id === id);
          setPartToDelete(part);
          setDeleteDialogOpen(true);
        }}
        loading={loading}
      />

      {/* Form Dialog */}
      <Dialog
        open={showForm || !!editingPart}
        onClose={() => {
          setShowForm(false);
          setEditingPart(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingPart ? 'Edit Spare Part' : 'Add New Spare Part'}
        </DialogTitle>
        <DialogContent>
          <SparePartForm
            part={editingPart}
            onSubmit={editingPart ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingPart(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Spare Part</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "
            <strong>{partToDelete?.partName}</strong>
            " ({partToDelete?.partCode})?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDelete(partToDelete.id);
              setDeleteDialogOpen(false);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar (simplified) */}
      {snackbar.open && (
        <Alert
          severity={snackbar.severity}
          sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      )}
    </Container>
  );
};

export default SparePartsPage;