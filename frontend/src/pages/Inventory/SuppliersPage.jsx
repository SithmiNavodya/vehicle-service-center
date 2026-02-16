// src/pages/Inventory/SuppliersPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Paper,
  Breadcrumbs,
  Link,
  Snackbar,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Store as SupplierIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import useSuppliers from '../../hooks/useSuppliers';
import SupplierForm from '../../components/Supplier/SupplierForm';
import SupplierList from '../../components/Supplier/SupplierList';

const SuppliersPage = () => {
  const {
    suppliers,
    loading,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    fetchSuppliers
  } = useSuppliers();

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCreateSupplier = async (supplierData) => {
    try {
      await createSupplier(supplierData);
      setShowForm(false);
      showSnackbar('Supplier registered successfully!', 'success');
    } catch (err) {
      showSnackbar('Failed to create supplier.', 'error');
    }
  };

  const handleUpdateSupplier = async (id, supplierData) => {
    try {
      await updateSupplier(id, supplierData);
      setEditingSupplier(null);
      showSnackbar('Supplier information updated.', 'success');
    } catch (err) {
      showSnackbar('Failed to update supplier.', 'error');
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await deleteSupplier(id);
      showSnackbar('Supplier removed from database.', 'success');
    } catch (err) {
      showSnackbar('Failed to delete supplier.', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (supplier.supplierName?.toLowerCase().includes(searchLower)) ||
      (supplier.supplierCode?.toLowerCase().includes(searchLower)) ||
      (supplier.email?.toLowerCase().includes(searchLower)) ||
      (supplier.phone?.includes(searchTerm))
    );
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
          <Typography color="primary.main" fontWeight="500">Inventory</Typography>
          <Typography color="text.primary" fontWeight="500">Suppliers</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              Supplier Directory
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Manage partnerships, procurement contact details and supplier codes
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
            Add Supplier
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 3, border: '1px solid #eee' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search by name, code, contact or email..."
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
            sx={{ flex: 1 }}
          />
          <IconButton onClick={fetchSuppliers} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ position: 'relative' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
            <Button size="small" onClick={fetchSuppliers} sx={{ ml: 2 }}>Retry</Button>
          </Alert>
        )}

        <SupplierList
          suppliers={filteredSuppliers}
          onEdit={(supplier) => setEditingSupplier(supplier)}
          onDelete={handleDeleteSupplier}
          loading={loading}
        />
      </Box>

      {/* Form Dialog */}
      {(showForm || editingSupplier) && (
        <SupplierForm
          supplier={editingSupplier}
          onClose={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
          onSubmit={editingSupplier ?
            (data) => handleUpdateSupplier(editingSupplier.id, data) :
            handleCreateSupplier
          }
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

export default SuppliersPage;
