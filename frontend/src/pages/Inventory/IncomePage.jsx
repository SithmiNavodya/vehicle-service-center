import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  CheckCircle as ReceiveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  TrendingUp as ChartIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import sparePartIncomeService from '../../services/sparePartIncomeService';
import { supplierService } from '../../services/supplierService';
import { sparePartService } from '../../services/sparePartService';

const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [pendingIncomes, setPendingIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    supplierId: '',
    orderDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: [{ sparePartId: '', quantityOrdered: 1, unitPrice: 0, totalPrice: 0 }]
  });

  const [suppliers, setSuppliers] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    fetchSuppliers();
    fetchSpareParts();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching income data...');

      // Fetch all incomes
      let allIncomes = [];
      try {
        const allIncomesResponse = await sparePartIncomeService.getAllIncomes();
        allIncomes = Array.isArray(allIncomesResponse.data) ? allIncomesResponse.data : [];
        console.log('✅ All incomes:', allIncomes.length);
      } catch (err) {
        console.warn('⚠️ Could not fetch all incomes:', err.message);
      }

      // Fetch pending incomes - with fallback
      let pending = [];
      try {
        const pendingIncomesResponse = await sparePartIncomeService.getPendingIncomes();
        pending = Array.isArray(pendingIncomesResponse.data) ? pendingIncomesResponse.data : [];
        console.log('✅ Pending incomes:', pending.length);
      } catch (err) {
        console.warn('⚠️ Could not fetch pending incomes:', err.message);
        // If pending fails, filter from all incomes
        pending = allIncomes.filter(income => income.status === 'PENDING');
      }

      setIncomes(allIncomes);
      setPendingIncomes(pending);
    } catch (err) {
      console.error('❌ Error fetching income records:', err);
      setError('Failed to fetch income records');
      showSnackbar('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const suppliersData = await supplierService.getAllSuppliers();
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
      showSnackbar('Failed to load suppliers', 'error');
    }
  };

  const fetchSpareParts = async () => {
    try {
      const partsData = await sparePartService.getAllSpareParts();
      setSpareParts(Array.isArray(partsData) ? partsData : []);
    } catch (err) {
      console.error('Failed to fetch spare parts:', err);
      showSnackbar('Failed to load spare parts', 'error');
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await sparePartService.getAllCategories();
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      supplierId: '',
      orderDate: new Date().toISOString().split('T')[0],
      notes: '',
      items: [{ sparePartId: '', quantityOrdered: 1, unitPrice: 0, totalPrice: 0 }]
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenViewDialog = (income) => {
    setSelectedIncome(income);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedIncome(null);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Calculate total price if quantity or unit price changes
    if (field === 'quantityOrdered' || field === 'unitPrice') {
      const quantity = field === 'quantityOrdered' ? value : updatedItems[index].quantityOrdered;
      const unitPrice = field === 'unitPrice' ? value : updatedItems[index].unitPrice;
      updatedItems[index].totalPrice = quantity * unitPrice;
    }

    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { sparePartId: '', quantityOrdered: 1, unitPrice: 0, totalPrice: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: updatedItems }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.supplierId) {
        showSnackbar('Please select a supplier', 'error');
        return;
      }

      if (formData.items.some(item => !item.sparePartId || item.quantityOrdered <= 0)) {
        showSnackbar('Please fill all item fields with valid values', 'error');
        return;
      }

      const incomeData = {
        supplierId: parseInt(formData.supplierId),
        orderDate: formData.orderDate,
        notes: formData.notes,
        items: formData.items.map(item => ({
          sparePartId: parseInt(item.sparePartId),
          quantityOrdered: parseInt(item.quantityOrdered),
          quantityReceived: 0,
          unitPrice: parseFloat(item.unitPrice),
          totalPrice: parseFloat(item.totalPrice)
        }))
      };

      console.log('Creating income:', incomeData);
      await sparePartIncomeService.createIncome(incomeData);
      showSnackbar('Income record created successfully', 'success');
      handleCloseDialog();
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create income record';
      showSnackbar(errorMsg, 'error');
      console.error('Create income error:', err);
    }
  };

  const handleReceiveIncome = async (id) => {
    try {
      await sparePartIncomeService.receiveIncome(id);
      showSnackbar('Income marked as received', 'success');
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to receive income';
      showSnackbar(errorMsg, 'error');
      console.error('Receive income error:', err);
    }
  };

  const handleCancelIncome = async (id) => {
    if (window.confirm('Are you sure you want to cancel this income record?')) {
      try {
        await sparePartIncomeService.cancelIncome(id);
        showSnackbar('Income cancelled successfully', 'success');
        fetchData();
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to cancel income';
        showSnackbar(errorMsg, 'error');
        console.error('Cancel income error:', err);
      }
    }
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await sparePartIncomeService.deleteIncome(id);
        showSnackbar('Income deleted successfully', 'success');
        fetchData();
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to delete income';
        showSnackbar(errorMsg, 'error');
        console.error('Delete income error:', err);
      }
    }
  };

  const handleFetchChartData = async () => {
    if (!selectedCategory) {
      showSnackbar('Please select a category first', 'warning');
      return;
    }

    try {
      setChartLoading(true);
      console.log('📊 Fetching chart data for category:', selectedCategory);

      const response = await sparePartIncomeService.getChartData(selectedCategory);
      console.log('📊 Chart data response:', response.data);

      if (response.data && response.data.incomeData) {
        // Use sample data for now if API returns empty
        const dataToUse = response.data.incomeData.length > 0
          ? response.data
          : generateSampleChartData();

        setChartData(dataToUse);
        setShowChart(true);
        showSnackbar('Chart data loaded', 'success');
      } else {
        const sampleData = generateSampleChartData();
        setChartData(sampleData);
        setShowChart(true);
        showSnackbar('Using sample chart data', 'info');
      }
    } catch (err) {
      console.error('Chart data error:', err);
      const sampleData = generateSampleChartData();
      setChartData(sampleData);
      setShowChart(true);
      showSnackbar('Using sample data due to API error', 'warning');
    } finally {
      setChartLoading(false);
    }
  };

  const generateSampleChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const incomeData = months.map(() => Math.floor(Math.random() * 100000) + 50000);
    const totalIncome = incomeData.reduce((sum, value) => sum + value, 0);

    return {
      labels: months,
      incomeData: incomeData,
      totalIncome: totalIncome,
      categoryName: categories.find(c => c.id == selectedCategory)?.categoryName || 'Sample Category',
      isSample: true
    };
  };

  const handleCloseChart = () => {
    setShowChart(false);
    setChartData(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'RECEIVED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-LK');
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'LKR 0.00';
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTotalAmount = () => {
    return formData.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  const renderChart = () => {
    if (!chartData || !chartData.incomeData || chartData.incomeData.length === 0) {
      return (
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No chart data available
          </Typography>
        </Box>
      );
    }

    const { labels, incomeData } = chartData;
    const maxValue = Math.max(...incomeData);

    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: 2, p: 2 }}>
        {labels.map((label, index) => {
          const value = incomeData[index] || 0;
          const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;

          return (
            <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ mb: 1 }}>
                {label}
              </Typography>
              <Box
                sx={{
                  height: `${heightPercent}%`,
                  width: '60%',
                  backgroundColor: chartData.isSample ? 'info.main' : 'primary.main',
                  borderRadius: '4px 4px 0 0',
                  position: 'relative',
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: chartData.isSample ? 'info.dark' : 'primary.dark',
                    transform: 'scale(1.05)'
                  }
                }}
              />
              <Typography variant="caption" sx={{ mt: 1 }}>
                {formatCurrency(value)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  if (loading && incomes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Loading income records...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Spare Part Income Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage incoming spare parts from suppliers
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Chart Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2} alignItems="center" direction={{ xs: 'column', md: 'row' }}>
            <Box sx={{ width: { xs: '100%', md: '40%' } }}>
              <FormControl fullWidth>
                <InputLabel>Select Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setShowChart(false);
                  }}
                  label="Select Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: { xs: '100%', md: '60%' } }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  startIcon={<ChartIcon />}
                  onClick={handleFetchChartData}
                  disabled={!selectedCategory || chartLoading}
                  sx={{ minWidth: 160 }}
                >
                  {chartLoading ? <CircularProgress size={24} /> : 'Generate Chart'}
                </Button>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  color="primary"
                >
                  New Income
                </Button>

                <IconButton onClick={fetchData} title="Refresh">
                  <RefreshIcon />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Chart Display */}
      {showChart && chartData && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Income Analysis - {chartData.categoryName || 'Selected Category'}
                  {chartData.isSample && (
                    <Chip
                      label="Sample Data"
                      color="info"
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Monthly Income Trends
                </Typography>
              </Box>
              <IconButton onClick={handleCloseChart} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            {renderChart()}

            {/* Statistics */}
            {chartData.totalIncome && (
              <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Statistics Summary
                </Typography>
                <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Total Income
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {formatCurrency(chartData.totalIncome)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Average
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(chartData.totalIncome / (chartData.incomeData?.length || 1))}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Data Points
                    </Typography>
                    <Typography variant="h6">
                      {chartData.incomeData?.length || 0}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}

            {chartData.isSample && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  This is sample chart data. Real data will appear when you have income records in the selected category.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Income Records Table */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
          <Tab label={`All Incomes (${incomes.length})`} />
          <Tab label={`Pending (${pendingIncomes.length})`} />
        </Tabs>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Received Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(tabValue === 0 ? incomes : pendingIncomes).map((income) => (
                <TableRow key={income.id} hover>
                  <TableCell>{income.orderNumber}</TableCell>
                  <TableCell>{formatDate(income.orderDate)}</TableCell>
                  <TableCell>{income.supplierName || 'N/A'}</TableCell>
                  <TableCell>{formatCurrency(income.totalAmount)}</TableCell>
                  <TableCell>
                    <Chip
                      label={income.status}
                      color={getStatusColor(income.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {income.receivedDate ? formatDate(income.receivedDate) : '-'}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenViewDialog(income)}
                        title="View Details"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>

                      {income.status === 'PENDING' && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleReceiveIncome(income.id)}
                            title="Mark as Received"
                            color="success"
                          >
                            <ReceiveIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleCancelIncome(income.id)}
                            title="Cancel"
                            color="warning"
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}

                      <IconButton
                        size="small"
                        onClick={() => handleDeleteIncome(income.id)}
                        title="Delete"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Income Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Income Record</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                select
                fullWidth
                label="Supplier"
                value={formData.supplierId}
                onChange={(e) => handleFormChange('supplierId', e.target.value)}
                required
              >
                <MenuItem value="">Select Supplier</MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.supplierName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                type="date"
                label="Order Date"
                value={formData.orderDate}
                onChange={(e) => handleFormChange('orderDate', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleFormChange('notes', e.target.value)}
            />

            <Box>
              <Typography variant="h6" gutterBottom>
                Items
                <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                  Total: {formatCurrency(getTotalAmount())}
                </Typography>
              </Typography>

              {formData.items.map((item, index) => (
                <Stack key={index} spacing={2} sx={{ mb: 2 }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      select
                      fullWidth
                      label="Spare Part"
                      value={item.sparePartId}
                      onChange={(e) => handleItemChange(index, 'sparePartId', e.target.value)}
                      required
                      size="small"
                    >
                      <MenuItem value="">Select Part</MenuItem>
                      {spareParts.map((part) => (
                        <MenuItem key={part.id} value={part.id}>
                          {part.partCode} - {part.partName}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity"
                      value={item.quantityOrdered}
                      onChange={(e) => handleItemChange(index, 'quantityOrdered', parseInt(e.target.value) || 0)}
                      required
                      size="small"
                      inputProps={{ min: 1 }}
                    />

                    <TextField
                      fullWidth
                      type="number"
                      label="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      required
                      size="small"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      fullWidth
                      label="Total"
                      value={formatCurrency(item.totalPrice)}
                      disabled
                      size="small"
                    />

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                      size="small"
                    >
                      Remove
                    </Button>
                  </Stack>
                </Stack>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addItem}
                sx={{ mt: 1 }}
              >
                Add Item
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create Income Record
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Income Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        {selectedIncome && (
          <>
            <DialogTitle>
              Income Details: {selectedIncome.orderNumber}
              <Chip
                label={selectedIncome.status}
                color={getStatusColor(selectedIncome.status)}
                size="small"
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Order Number
                    </Typography>
                    <Typography variant="body1">
                      {selectedIncome.orderNumber}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Order Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedIncome.orderDate)}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Supplier
                    </Typography>
                    <Typography variant="body1">
                      {selectedIncome.supplierName || 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Amount
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatCurrency(selectedIncome.totalAmount)}
                    </Typography>
                  </Box>
                </Stack>

                {selectedIncome.receivedDate && (
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Received Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedIncome.receivedDate)}
                    </Typography>
                  </Box>
                )}

                {/* ITEMS SECTION */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Items ({selectedIncome.items?.length || 0})
                  </Typography>

                  {selectedIncome.items && selectedIncome.items.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Part Code</TableCell>
                            <TableCell>Part Name</TableCell>
                            <TableCell align="center">Ordered Qty</TableCell>
                            <TableCell align="center">Received Qty</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="right">Total Price</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedIncome.items.map((item, index) => (
                            <TableRow key={item.id || index}>
                              <TableCell>{item.partCode || 'N/A'}</TableCell>
                              <TableCell>{item.partName || 'N/A'}</TableCell>
                              <TableCell align="center">{item.quantityOrdered || 0}</TableCell>
                              <TableCell align="center">{item.quantityReceived || 0}</TableCell>
                              <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                              <TableCell align="right">{formatCurrency(item.totalPrice)}</TableCell>
                              <TableCell>
                                <Chip
                                  label={item.status || 'N/A'}
                                  size="small"
                                  color={getStatusColor(item.status)}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                      No items found for this order.
                    </Typography>
                  )}
                </Box>

                {selectedIncome.notes && (
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Notes
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {selectedIncome.notes}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseViewDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default IncomePage;