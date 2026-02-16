// src/pages/Inventory/UsagePage.jsx
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
  Stack,
  Breadcrumbs,
  Link,
  Tooltip,
  Divider,
  Avatar,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  TrendingUp as ChartIcon,
  Inventory as StockIcon,
  NavigateNext as NavigateNextIcon,
  Build as BuildIcon,
  Engineering as TechIcon,
  DirectionsCar as CarIcon,
  History as HistoryIcon,
  Close as CloseIcon
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell
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
  const [chartType, setChartType] = useState('line');

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

  const COLORS = ['#1976d2', '#21CBF3', '#4caf50', '#ff9800', '#f44336', '#9c27b0'];

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
      setUsages(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to fetch usage records');
      showSnackbar('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpareParts = async () => {
    try {
      const data = await sparePartService.getAllSpareParts();
      setSpareParts(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  const fetchServiceRecords = async () => {
    try {
      const data = await serviceRecordService.getAllServiceRecords();
      setServiceRecords(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getAllVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const data = await sparePartService.getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatCurrency = (amount) => {
    return `Rs. ${(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const StatCard = ({ title, value, icon, color, bg }) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        background: bg,
        color: color,
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
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, transform: 'rotate(15deg)', color: color }}>
          {React.cloneElement(icon, { sx: { fontSize: 80 } })}
        </Box>

        <Stack spacing={0.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {React.cloneElement(icon, { sx: { fontSize: 24 } })}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 1 }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>
            {value}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', opacity: 0.8 }}>
            Consumption Telemetry
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

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

  const handleFormChange = (field, value) => {
    const updatedForm = { ...formData, [field]: value };
    if (field === 'sparePartId') {
      const part = spareParts.find(p => p.id === parseInt(value));
      if (part) updatedForm.unitPrice = part.price || 0;
    }
    if (field === 'serviceRecordId') {
      const rec = serviceRecords.find(sr => sr.id === parseInt(value));
      if (rec && rec.vehicleId) updatedForm.vehicleId = rec.vehicleId;
    }
    setFormData(updatedForm);
  };

  const handleSubmit = async () => {
    try {
      const part = spareParts.find(p => p.id === parseInt(formData.sparePartId));
      if (part && formData.quantityUsed > part.quantity) {
        showSnackbar(`Stock Alert: Only ${part.quantity} available!`, 'error');
        return;
      }
      await sparePartUsageService.createUsage(formData);
      showSnackbar('Consumption record saved!', 'success');
      setOpenDialog(false);
      fetchData();
      fetchSpareParts();
    } catch (err) {
      showSnackbar('Failed to record usage.', 'error');
    }
  };

  const handleFetchChartData = async () => {
    if (!selectedCategory) return;
    try {
      const response = await sparePartUsageService.getUsageChartData(selectedCategory);
      setChartData(transformChartData(response.data));
      setShowChart(true); setShowStockFlow(false);
    } catch (err) {
      setChartData(getSampleChartData());
      setShowChart(true); setShowStockFlow(false);
    }
  };

  const handleFetchStockFlowData = async () => {
    if (!selectedCategory) return;
    try {
      const response = await sparePartUsageService.getStockFlowData(selectedCategory);
      setStockFlowData(transformStockFlowData(response.data));
      setShowStockFlow(true); setShowChart(false);
    } catch (err) {
      setStockFlowData(getSampleStockFlowData());
      setShowStockFlow(true); setShowChart(false);
    }
  };

  const transformChartData = (data) => {
    if (!data?.monthlyData) return getSampleChartData();
    return data.monthlyData.map(m => ({ name: m.month, usageCount: m.usageCount, totalCost: m.totalCost }));
  };

  const transformStockFlowData = (data) => {
    if (!data?.flowData) return getSampleStockFlowData();
    return data;
  };

  const getSampleChartData = () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => ({
    name: m, usageCount: Math.floor(Math.random() * 40) + 10, totalCost: Math.floor(Math.random() * 80000) + 20000
  }));

  const getSampleStockFlowData = () => ({
    categoryName: categories.find(c => c.id == selectedCategory)?.categoryName || 'General',
    flowData: [
      { partName: 'Oil Filter', currentStock: 25, totalUsed: 45 },
      { partName: 'Brake Pads', currentStock: 12, totalUsed: 28 },
      { partName: 'Air Filter', currentStock: 30, totalUsed: 15 }
    ]
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
          <Typography color="primary.main" fontWeight="500">Inventory</Typography>
          <Typography color="text.primary" fontWeight="500">Consumption</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BuildIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              Usage Tracker
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Real-time tracking of spare part consumption across service operations
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{
              borderRadius: 2, px: 4, py: 1.5, textTransform: 'none', fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Record Usage
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Utilizations" value={usages.length} icon={<HistoryIcon />} color="#1976d2" bg="linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Active Techs" value={new Set(usages.map(u => u.technicianName)).size} icon={<TechIcon />} color="#9c27b0" bg="linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Vehicles Serviced" value={new Set(usages.map(u => u.vehicleId)).size} icon={<CarIcon />} color="#2e7d32" bg="linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Expenditure" value={formatCurrency(usages.reduce((a, b) => a + (b.totalCost || 0), 0))} icon={<ChartIcon />} color="#ed6c02" bg="linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)" />
        </Grid>
      </Grid>

      {/* Intelligence Section */}
      <Card sx={{ mb: 4, borderRadius: 3, border: '1px solid #eee' }} elevation={0}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <FormControl sx={{ minWidth: 300 }} size="small">
              <InputLabel>Inventory Flow Analysis</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Inventory Flow Analysis"
                sx={{ borderRadius: 2 }}
              >
                {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.categoryName}</MenuItem>)}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<ChartIcon />} onClick={handleFetchChartData} disabled={!selectedCategory}>Trends</Button>
              <Button variant="outlined" startIcon={<StockIcon />} onClick={handleFetchStockFlowData} disabled={!selectedCategory}>Flow</Button>
            </Stack>
            {(showChart || showStockFlow) && <IconButton onClick={() => { setShowChart(false); setShowStockFlow(false); }}><CloseIcon /></IconButton>}
            <Box sx={{ flex: 1 }} />
            <IconButton onClick={fetchData} sx={{ border: '1px solid #eee' }}><RefreshIcon /></IconButton>
          </Stack>

          {showChart && chartData && (
            <Box sx={{ height: 350, mt: 4, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="usageCount" stroke="#1976d2" strokeWidth={3} dot={{ r: 6 }} name="Units Used" />
                  <Line type="monotone" dataKey="totalCost" stroke="#4caf50" strokeWidth={3} dot={{ r: 6 }} name="Expenditure" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}

          {showStockFlow && stockFlowData && (
            <Box sx={{ height: 350, mt: 4, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockFlowData.flowData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="partName" width={120} axisLine={false} tickLine={false} />
                  <RechartsTooltip />
                  <Bar dataKey="currentStock" fill="#1976d2" radius={[0, 4, 4, 0]} name="In Stock" />
                  <Bar dataKey="totalUsed" fill="#ff9800" radius={[0, 4, 4, 0]} name="Historical Use" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Usage History Table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }} elevation={3}>
        <Box sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.04)', display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">Consumption Registry</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Doc ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Component</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Units</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Valuation</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Assigned Tech</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usages.map((usage) => (
                <TableRow key={usage.id} hover>
                  <TableCell><Typography variant="body2" fontWeight="bold">{usage.usageNumber}</Typography></TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">{usage.sparePartName}</Typography>
                      <Typography variant="caption" color="textSecondary">{usage.sparePartCode}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{usage.quantityUsed}</TableCell>
                  <TableCell>{formatCurrency(usage.totalCost)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{usage.technicianName?.charAt(0)}</Avatar>
                      <Typography variant="body2">{usage.technicianName || '---'}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{formatDate(usage.usageDate)}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton size="small" color="primary" onClick={() => { setSelectedUsage(usage); setOpenViewDialog(true); }} sx={{ bgcolor: 'primary.light', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}><ViewIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => { if (window.confirm('Erase this record?')) sparePartUsageService.deleteUsage(usage.id).then(fetchData) }} sx={{ bgcolor: 'error.light', color: 'white', '&:hover': { bgcolor: 'error.main' } }}><DeleteIcon fontSize="small" /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Record Usage Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">Record Spare Part Consumption</Typography>
          <IconButton onClick={() => setOpenDialog(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField select fullWidth label="Select Spare Part" value={formData.sparePartId} onChange={(e) => handleFormChange('sparePartId', e.target.value)}>
                {spareParts.map(p => <MenuItem key={p.id} value={p.id}>{p.partCode} - {p.partName} (Stock: {p.quantity})</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Quantity to Use" value={formData.quantityUsed} onChange={(e) => setFormData(p => ({ ...p, quantityUsed: e.target.value }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth label="Service Ticket Reference" value={formData.serviceRecordId} onChange={(e) => handleFormChange('serviceRecordId', e.target.value)}>
                <MenuItem value="">Direct Use (No Ticket)</MenuItem>
                {serviceRecords.map(sr => <MenuItem key={sr.id} value={sr.id}>{sr.serviceNumber} - {sr.vehiclePlate}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Responsible Technician" value={formData.technicianName} onChange={(e) => setFormData(p => ({ ...p, technicianName: e.target.value }))} />
            </Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Usage Rationale / Notes" value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">Discard</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)' }}>Confirm Consumption</Button>
        </DialogActions>
      </Dialog>

      {/* Details View */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Usage Details # {selectedUsage?.usageNumber}</Typography>
          <IconButton onClick={() => setOpenViewDialog(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUsage && (
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="textSecondary">Spare Part:</Typography>
                <Typography fontWeight="bold">{selectedUsage.sparePartName} ({selectedUsage.sparePartCode})</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="textSecondary">Quantity Extracted:</Typography>
                <Typography fontWeight="bold">{selectedUsage.quantityUsed} Units</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="textSecondary">Assigned Vehicle:</Typography>
                <Typography fontWeight="bold">{selectedUsage.vehicleInfo || 'General Inventory Use'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="textSecondary">Technician:</Typography>
                <Typography fontWeight="bold">{selectedUsage.technicianName || 'Standard Staff'}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Economic Value:</Typography>
                <Typography variant="h6" color="primary">{formatCurrency(selectedUsage.totalCost)}</Typography>
              </Box>
              {selectedUsage.notes && (
                <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="textSecondary">OPERATIONAL NOTES</Typography>
                  <Typography variant="body2">{selectedUsage.notes}</Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default UsagePage;