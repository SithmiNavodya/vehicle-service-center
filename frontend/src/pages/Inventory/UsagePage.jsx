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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
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
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  TrendingUp as ChartIcon,
  Inventory as StockIcon
} from '@mui/icons-material';
import { sparePartUsageService } from '../../services/sparePartUsageService';
import { sparePartService } from '../../services/sparePartService';
import serviceRecordService from '../../services/serviceRecordService';
import vehicleService from '../../services/vehicleService';

// Chart components
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const UsagePage = () => {
  const [usages, setUsages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedUsage, setSelectedUsage] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [chartData, setChartData] = useState(null);
  const [stockFlowData, setStockFlowData] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [showStockFlow, setShowStockFlow] = useState(false);
  const [chartType, setChartType] = useState('line'); // 'line', 'bar', or 'pie'

  // Form state
  const [formData, setFormData] = useState({
    sparePartId: '',
    quantityUsed: 1,
    unitPrice: 0,
    serviceRecordId: '',
    vehicleId: '',
    technicianName: '',
    notes: ''
  });

  const [spareParts, setSpareParts] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    fetchSpareParts();
    fetchServiceRecords();
    fetchVehicles();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await sparePartUsageService.getAllUsage();
      const usageData = Array.isArray(response.data) ? response.data : [];
      setUsages(usageData);
    } catch (err) {
      setError('Failed to fetch usage records');
      showSnackbar('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
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

  const fetchServiceRecords = async () => {
    try {
      const recordsData = await serviceRecordService.getAllServiceRecords();
      setServiceRecords(Array.isArray(recordsData) ? recordsData : []);
    } catch (err) {
      console.error('Failed to fetch service records:', err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const vehiclesData = await vehicleService.getAllVehicles();
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
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
      sparePartId: '',
      quantityUsed: 1,
      unitPrice: 0,
      serviceRecordId: '',
      vehicleId: '',
      technicianName: '',
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenViewDialog = (usage) => {
    setSelectedUsage(usage);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedUsage(null);
  };

  const handleFormChange = (field, value) => {
    const updatedForm = { ...formData, [field]: value };

    // Auto-fill unit price when spare part is selected
    if (field === 'sparePartId') {
      const selectedPart = spareParts.find(part => part.id === parseInt(value));
      if (selectedPart) {
        updatedForm.unitPrice = selectedPart.price || 0;
      }
    }

    // Auto-select vehicle when service record is selected
    if (field === 'serviceRecordId') {
      const record = serviceRecords.find(sr => sr.id === parseInt(value));
      if (record && record.vehicleId) {
        updatedForm.vehicleId = record.vehicleId;
      }
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.sparePartId) {
        showSnackbar('Please select a spare part', 'error');
        return;
      }

      if (!formData.quantityUsed || formData.quantityUsed <= 0) {
        showSnackbar('Please enter a valid quantity', 'error');
        return;
      }

      // Check if enough stock is available
      const selectedPart = spareParts.find(part => part.id === parseInt(formData.sparePartId));
      if (selectedPart && formData.quantityUsed > selectedPart.quantity) {
        showSnackbar(`Insufficient stock! Available: ${selectedPart.quantity}`, 'error');
        return;
      }

      const usageData = {
        sparePartId: parseInt(formData.sparePartId),
        quantityUsed: parseInt(formData.quantityUsed),
        unitPrice: parseFloat(formData.unitPrice),
        serviceRecordId: formData.serviceRecordId ? parseInt(formData.serviceRecordId) : null,
        vehicleId: formData.vehicleId ? parseInt(formData.vehicleId) : null,
        technicianName: formData.technicianName || '',
        notes: formData.notes || ''
      };

      console.log('Creating usage:', usageData);
      await sparePartUsageService.createUsage(usageData);
      showSnackbar('Usage recorded successfully', 'success');
      handleCloseDialog();
      fetchData();
      fetchSpareParts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to record usage';
      showSnackbar(errorMessage, 'error');
      console.error('Create usage error:', err);
    }
  };

  const handleDeleteUsage = async (id) => {
    if (window.confirm('Are you sure you want to delete this usage record?')) {
      try {
        await sparePartUsageService.deleteUsage(id);
        showSnackbar('Usage deleted successfully', 'success');
        fetchData();
        fetchSpareParts();
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete usage';
        showSnackbar(errorMessage, 'error');
        console.error('Delete usage error:', err);
      }
    }
  };

  const handleFetchChartData = async () => {
    if (!selectedCategory) {
      showSnackbar('Please select a category first', 'warning');
      return;
    }

    try {
      setLoading(true);
      const response = await sparePartUsageService.getUsageChartData(selectedCategory);
      console.log('Chart data response:', response.data);

      // Transform data for charts
      const transformedData = transformChartData(response.data);
      setChartData(transformedData);
      setShowChart(true);
      setShowStockFlow(false);
    } catch (err) {
      console.error('Chart data error:', err);
      showSnackbar('Failed to fetch chart data. Using sample data instead.', 'warning');

      // Use sample data if backend fails
      setChartData(getSampleChartData());
      setShowChart(true);
      setShowStockFlow(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchStockFlowData = async () => {
    if (!selectedCategory) {
      showSnackbar('Please select a category first', 'warning');
      return;
    }

    try {
      setLoading(true);
      const response = await sparePartUsageService.getStockFlowData(selectedCategory);
      console.log('Stock flow data:', response.data);

      // Transform data for display
      const transformedData = transformStockFlowData(response.data);
      setStockFlowData(transformedData);
      setShowStockFlow(true);
      setShowChart(false);
    } catch (err) {
      console.error('Stock flow error:', err);
      showSnackbar('Failed to fetch stock flow data. Using sample data instead.', 'warning');

      // Use sample data if backend fails
      setStockFlowData(getSampleStockFlowData());
      setShowStockFlow(true);
      setShowChart(false);
    } finally {
      setLoading(false);
    }
  };

  // Transform chart data from backend format
  const transformChartData = (data) => {
    if (!data) return getSampleChartData();

    // If data has monthlyData array
    if (data.monthlyData && Array.isArray(data.monthlyData)) {
      return data.monthlyData.map(item => ({
        name: item.month || 'Unknown',
        usageCount: item.usageCount || 0,
        totalCost: item.totalCost || 0
      }));
    }

    // If data is direct array
    if (Array.isArray(data)) {
      return data.map((item, index) => ({
        name: item.month || `Month ${index + 1}`,
        usageCount: item.count || 0,
        totalCost: item.cost || 0
      }));
    }

    return getSampleChartData();
  };

  // Transform stock flow data
  const transformStockFlowData = (data) => {
    if (!data) return getSampleStockFlowData();

    // If data has flowData array
    if (data.flowData && Array.isArray(data.flowData)) {
      return {
        categoryName: data.categoryName || 'Selected Category',
        flowData: data.flowData,
        totalParts: data.totalParts || 0,
        activeParts: data.activeParts || 0
      };
    }

    return getSampleStockFlowData();
  };

  // Sample chart data for fallback
  const getSampleChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    return months.map((month, index) => ({
      name: month,
      usageCount: Math.floor(Math.random() * 50) + 10,
      totalCost: Math.floor(Math.random() * 100000) + 50000
    }));
  };

  // Sample stock flow data for fallback
  const getSampleStockFlowData = () => {
    const parts = [
      { partCode: 'PART_001', partName: 'Oil Filter', currentStock: 25, totalUsed: 45, usageRate: 7.5 },
      { partCode: 'PART_002', partName: 'Brake Pads', currentStock: 15, totalUsed: 28, usageRate: 4.7 },
      { partCode: 'PART_003', partName: 'Air Filter', currentStock: 30, totalUsed: 22, usageRate: 3.7 },
      { partCode: 'PART_004', partName: 'Spark Plug', currentStock: 40, totalUsed: 18, usageRate: 3.0 },
      { partCode: 'PART_005', partName: 'Battery', currentStock: 8, totalUsed: 12, usageRate: 2.0 }
    ];

    return {
      categoryName: 'Sample Category',
      flowData: parts,
      totalParts: 5,
      activeParts: 5
    };
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

  const getSelectedSparePart = () => {
    return spareParts.find(part => part.id === parseInt(formData.sparePartId));
  };

  if (loading && usages.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Spare Part Usage Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Track and manage spare parts usage for services
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Category Selection for Charts */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2} alignItems="center" direction={{ xs: 'column', md: 'row' }}>
            <Box sx={{ width: { xs: '100%', md: '40%' } }}>
              <FormControl fullWidth>
                <InputLabel>Select Category for Analysis</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Select Category for Analysis"
                >
                  <MenuItem value="">Select Category</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: { xs: '100%', md: '60%' } }}>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<ChartIcon />}
                  onClick={handleFetchChartData}
                  disabled={!selectedCategory || loading}
                >
                  {loading ? 'Loading...' : 'View Usage Chart'}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<StockIcon />}
                  onClick={handleFetchStockFlowData}
                  disabled={!selectedCategory || loading}
                >
                  {loading ? 'Loading...' : 'View Stock Flow'}
                </Button>

                {showChart && chartData && (
                  <Select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="line">Line Chart</MenuItem>
                    <MenuItem value="bar">Bar Chart</MenuItem>
                    <MenuItem value="pie">Pie Chart</MenuItem>
                  </Select>
                )}

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  sx={{ ml: 'auto' }}
                >
                  Record Usage
                </Button>

                <IconButton onClick={fetchData}>
                  <RefreshIcon />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Charts Display */}
      {showChart && chartData && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Usage Trends - {selectedCategory ? categories.find(c => c.id == selectedCategory)?.categoryName : 'Selected Category'}
            </Typography>

            <Box sx={{ height: 400, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'totalCost') return [formatCurrency(value), 'Total Cost'];
                        return [value, name === 'usageCount' ? 'Usage Count' : name];
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="usageCount"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Usage Count"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="totalCost"
                      stroke="#82ca9d"
                      name="Total Cost"
                    />
                  </LineChart>
                ) : chartType === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'totalCost') return [formatCurrency(value), 'Total Cost'];
                        return [value, name === 'usageCount' ? 'Usage Count' : name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="usageCount" fill="#8884d8" name="Usage Count" />
                    <Bar dataKey="totalCost" fill="#82ca9d" name="Total Cost" />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.usageCount}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="usageCount"
                      name="Usage Count"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </Box>

            <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Total Usage Count
                </Typography>
                <Typography variant="h6">
                  {chartData.reduce((sum, item) => sum + (item.usageCount || 0), 0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Total Cost
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(chartData.reduce((sum, item) => sum + (item.totalCost || 0), 0))}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Data Points
                </Typography>
                <Typography variant="h6">
                  {chartData.length}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {showStockFlow && stockFlowData && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Stock Flow Analysis - {stockFlowData.categoryName || 'Selected Category'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Total Parts: {stockFlowData.totalParts || 0} |
              Active Parts: {stockFlowData.activeParts || 0}
            </Typography>

            {/* Stock Flow Chart */}
            <Box sx={{ height: 300, width: '100%', mb: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stockFlowData.flowData}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="partName" width={150} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'usageRate') return [value.toFixed(2), 'Usage Rate (per month)'];
                      return [value, name === 'currentStock' ? 'Current Stock' : 'Total Used'];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="currentStock" fill="#8884d8" name="Current Stock" />
                  <Bar dataKey="totalUsed" fill="#82ca9d" name="Total Used" />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* Stock Flow Table */}
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Part Code</TableCell>
                    <TableCell>Part Name</TableCell>
                    <TableCell align="center">Current Stock</TableCell>
                    <TableCell align="center">Total Used</TableCell>
                    <TableCell align="center">Usage Rate/Month</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(stockFlowData.flowData || []).map((part, index) => (
                    <TableRow key={index}>
                      <TableCell>{part.partCode}</TableCell>
                      <TableCell>{part.partName}</TableCell>
                      <TableCell align="center">{part.currentStock}</TableCell>
                      <TableCell align="center">{part.totalUsed}</TableCell>
                      <TableCell align="center">{part.usageRate?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={part.currentStock <= 10 ? 'Low Stock' : 'In Stock'}
                          size="small"
                          color={part.currentStock <= 10 ? 'error' : 'success'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Usage Records Table */}
      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usage Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Part</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Cost</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Technician</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usages.map((usage) => (
                <TableRow key={usage.id} hover>
                  <TableCell>{usage.usageNumber}</TableCell>
                  <TableCell>{formatDate(usage.usageDate)}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{usage.sparePartCode || 'N/A'}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {usage.sparePartName || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{usage.quantityUsed || 0}</TableCell>
                  <TableCell>{formatCurrency(usage.unitPrice)}</TableCell>
                  <TableCell>{formatCurrency(usage.totalCost)}</TableCell>
                  <TableCell>
                    {usage.vehicleInfo ? (
                      <Typography variant="body2">
                        {usage.vehicleInfo}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="textSecondary">
                        Not linked
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{usage.technicianName || '-'}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenViewDialog(usage)}
                        title="View Details"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUsage(usage.id)}
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

      {/* Create Usage Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Record Spare Part Usage</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                select
                fullWidth
                label="Spare Part *"
                value={formData.sparePartId}
                onChange={(e) => handleFormChange('sparePartId', e.target.value)}
                required
              >
                <MenuItem value="">Select Spare Part</MenuItem>
                {spareParts.map((part) => (
                  <MenuItem key={part.id} value={part.id}>
                    {part.partCode} - {part.partName}
                    {part.quantity !== undefined && ` (Stock: ${part.quantity})`}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                type="number"
                label="Quantity *"
                value={formData.quantityUsed}
                onChange={(e) => handleFormChange('quantityUsed', parseInt(e.target.value) || 0)}
                required
                inputProps={{ min: 1 }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                type="number"
                label="Unit Price *"
                value={formData.unitPrice}
                onChange={(e) => handleFormChange('unitPrice', parseFloat(e.target.value) || 0)}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  Total Cost: {formatCurrency(formData.quantityUsed * formData.unitPrice)}
                </Typography>
              </Box>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                select
                fullWidth
                label="Service Record (Optional)"
                value={formData.serviceRecordId}
                onChange={(e) => handleFormChange('serviceRecordId', e.target.value)}
              >
                <MenuItem value="">No Service Record</MenuItem>
                {serviceRecords.map((record) => (
                  <MenuItem key={record.id} value={record.id}>
                    {record.recordId} - {record.vehicleInfo || 'N/A'}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Vehicle (Optional)"
                value={formData.vehicleId}
                onChange={(e) => handleFormChange('vehicleId', e.target.value)}
              >
                <MenuItem value="">No Vehicle</MenuItem>
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicleNumber} - {vehicle.brand} {vehicle.model}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <TextField
              fullWidth
              label="Technician Name"
              value={formData.technicianName}
              onChange={(e) => handleFormChange('technicianName', e.target.value)}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleFormChange('notes', e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Record Usage
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Usage Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        {selectedUsage && (
          <>
            <DialogTitle>
              Usage Details: {selectedUsage.usageNumber}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Usage Number
                    </Typography>
                    <Typography variant="body1">
                      {selectedUsage.usageNumber}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedUsage.usageDate)}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Spare Part
                    </Typography>
                    <Typography variant="body1">
                      {selectedUsage.sparePartCode} - {selectedUsage.sparePartName}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 0.5 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Quantity Used
                    </Typography>
                    <Typography variant="body1">
                      {selectedUsage.quantityUsed}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 0.5 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Unit Price
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(selectedUsage.unitPrice)}
                    </Typography>
                  </Box>
                </Stack>

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Cost
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(selectedUsage.totalCost)}
                  </Typography>
                </Box>

                {selectedUsage.vehicleInfo && (
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Vehicle
                    </Typography>
                    <Typography variant="body1">
                      {selectedUsage.vehicleInfo}
                    </Typography>
                  </Box>
                )}

                {selectedUsage.technicianName && (
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Technician
                    </Typography>
                    <Typography variant="body1">
                      {selectedUsage.technicianName}
                    </Typography>
                  </Box>
                )}

                {selectedUsage.notes && (
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Notes
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {selectedUsage.notes}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Recorded On
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedUsage.createdAt)}
                  </Typography>
                </Box>
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

export default UsagePage;