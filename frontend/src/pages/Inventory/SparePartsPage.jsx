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
  Alert,
  Paper,
  Chip,
  Breadcrumbs,
  Link,
  Snackbar,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  FilterList as FilterListIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as TotalValueIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { sparePartService } from '../../services/sparePartService';
import SparePartForm from '../../components/spareparts/SparePartForm';
import SparePartList from '../../components/spareparts/SparePartList';

const SparePartsPage = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [filter, setFilter] = useState('all'); // all, low-stock, in-stock
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch spare parts
  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      const data = await sparePartService.getAllSpareParts();
      setSpareParts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load spare parts inventory database.');
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

  const handleCreate = async (partData) => {
    try {
      await sparePartService.createSparePart(partData);
      setShowForm(false);
      showSnackbar('New spare part registered successfully!', 'success');
      fetchSpareParts();
    } catch (err) {
      showSnackbar(err.message || 'Failed to create spare part.', 'error');
    }
  };

  const handleUpdate = async (partData) => {
    try {
      await sparePartService.updateSparePart(editingPart.id, partData);
      setEditingPart(null);
      showSnackbar('Inventory record updated successfully!', 'success');
      fetchSpareParts();
    } catch (err) {
      showSnackbar(err.message || 'Failed to update spare part.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await sparePartService.deleteSparePart(id);
      showSnackbar('Spare part removed from inventory.', 'success');
      fetchSpareParts();
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete spare part.', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Stats Data
  const stats = [
    {
      title: 'Inventory Size',
      value: spareParts.length,
      subtitle: 'Total Unique items',
      icon: <InventoryIcon sx={{ fontSize: 32 }} />,
      color: '#1976d2',
      bg: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    },
    {
      title: 'Low Stock Alerts',
      value: spareParts.filter(p => p.quantity <= p.minQuantity).length,
      subtitle: 'Critical fulfillment',
      icon: <WarningIcon sx={{ fontSize: 32 }} />,
      color: '#dc004e',
      bg: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
    },
    {
      title: 'Healthy Stock',
      value: spareParts.filter(p => p.quantity > p.minQuantity).length,
      subtitle: 'Operational items',
      icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
      color: '#2e7d32',
      bg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    },
    {
      title: 'Inventory Value',
      value: `Rs. ${spareParts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      subtitle: 'Estimated Total',
      icon: <TotalValueIcon sx={{ fontSize: 32 }} />,
      color: '#ed6c02',
      bg: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
          <Typography color="primary.main" fontWeight="500">Inventory</Typography>
          <Typography color="text.primary" fontWeight="500">Spare Parts</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              Spare Parts Inventory
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Manage spare parts records, stock levels and category associations
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Add Spare Part
          </Button>
        </Box>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                color: stat.color,
                background: stat.bg,
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.03)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, transform: 'rotate(15deg)', color: stat.color }}>
                {React.cloneElement(stat.icon, { sx: { fontSize: 80 } })}
              </Box>

              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 24 } })}
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 1 }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', opacity: 0.8 }}>
                  {stat.subtitle}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Search and Filters */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 3, border: '1px solid #eee' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by part code, name, brand, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
            sx={{ flex: 1, minWidth: '300px' }}
          />

          <Stack direction="row" spacing={1}>
            <Chip
              label="All"
              onClick={() => setFilter('all')}
              color={filter === 'all' ? 'primary' : 'default'}
              sx={{ fontWeight: 'bold' }}
            />
            <Chip
              label="Low Stock"
              icon={<WarningIcon fontSize="small" />}
              onClick={() => setFilter('low-stock')}
              color={filter === 'low-stock' ? 'error' : 'default'}
              sx={{ fontWeight: 'bold' }}
            />
            <Chip
              label="In Stock"
              icon={<CheckCircleIcon fontSize="small" />}
              onClick={() => setFilter('in-stock')}
              color={filter === 'in-stock' ? 'success' : 'default'}
              sx={{ fontWeight: 'bold' }}
            />
          </Stack>

          <IconButton
            onClick={fetchSpareParts}
            disabled={loading}
            sx={{ border: '1px solid #ccc', borderRadius: 2 }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Main List Section */}
      <Box sx={{ position: 'relative' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
            <Button size="small" onClick={fetchSpareParts} sx={{ ml: 2 }}>Retry</Button>
          </Alert>
        )}

        <SparePartList
          spareParts={searchedParts}
          onEdit={(part) => setEditingPart(part)}
          onDelete={handleDelete}
          loading={loading}
        />
      </Box>

      {/* Form Dialog */}
      {(showForm || editingPart) && (
        <SparePartForm
          part={editingPart}
          onSubmit={editingPart ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingPart(null);
          }}
        />
      )}

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SparePartsPage;
