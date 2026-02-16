// src/pages/Inventory/IncomePage.jsx
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
  CheckCircle as ReceiveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  TrendingUp as ChartIcon,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  Business as BusinessIcon,
  History as HistoryIcon,
  PendingActions as PendingIcon,
  AssignmentTurnedIn as ReceivedIcon
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

  useEffect(() => {
    fetchData();
    fetchSuppliers();
    fetchSpareParts();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const allIncomesResponse = await sparePartIncomeService.getAllIncomes();
      const allIncomes = Array.isArray(allIncomesResponse.data) ? allIncomesResponse.data : [];

      const pendingIncomesResponse = await sparePartIncomeService.getPendingIncomes();
      const pending = Array.isArray(pendingIncomesResponse.data) ? pendingIncomesResponse.data : allIncomes.filter(i => i.status === 'PENDING');

      setIncomes(allIncomes);
      setPendingIncomes(pending);
    } catch (err) {
      setError('Failed to fetch income records');
      showSnackbar('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await supplierService.getAllSuppliers();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  };

  const fetchSpareParts = async () => {
    try {
      const data = await sparePartService.getAllSpareParts();
      setSpareParts(Array.isArray(data) ? data : []);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'RECEIVED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  // Stats Card Component
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
            Procurement Analytics
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  const handleOpenDialog = () => {
    setFormData({
      supplierId: '',
      orderDate: new Date().toISOString().split('T')[0],
      notes: '',
      items: [{ sparePartId: '', quantityOrdered: 1, unitPrice: 0, totalPrice: 0 }]
    });
    setOpenDialog(true);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    if (field === 'quantityOrdered' || field === 'unitPrice') {
      const q = parseFloat(field === 'quantityOrdered' ? value : updatedItems[index].quantityOrdered) || 0;
      const p = parseFloat(field === 'unitPrice' ? value : updatedItems[index].unitPrice) || 0;
      updatedItems[index].totalPrice = q * p;
    }
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async () => {
    try {
      const incomeData = {
        supplierId: parseInt(formData.supplierId),
        orderDate: formData.orderDate,
        notes: formData.notes,
        items: formData.items.map(item => ({
          sparePartId: parseInt(item.sparePartId),
          quantityOrdered: parseInt(item.quantityOrdered),
          unitPrice: parseFloat(item.unitPrice),
          totalPrice: parseFloat(item.totalPrice)
        }))
      };
      await sparePartIncomeService.createIncome(incomeData);
      showSnackbar('Procurement record registered!', 'success');
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      showSnackbar('Failed to register income.', 'error');
    }
  };

  const handleReceiveIncome = async (id) => {
    try {
      await sparePartIncomeService.receiveIncome(id);
      showSnackbar('Inventory restock successful!', 'success');
      fetchData();
    } catch (err) {
      showSnackbar('Restock failed.', 'error');
    }
  };

  const handleFetchChartData = async () => {
    if (!selectedCategory) return;
    try {
      setChartLoading(true);
      const response = await sparePartIncomeService.getChartData(selectedCategory);
      setChartData(response.data?.incomeData?.length > 0 ? response.data : generateSampleData());
      setShowChart(true);
    } catch (err) {
      setChartData(generateSampleData());
      setShowChart(true);
    } finally {
      setChartLoading(false);
    }
  };

  const generateSampleData = () => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    incomeData: [45000, 52000, 48000, 61000, 55000, 67000],
    totalIncome: 328000,
    categoryName: categories.find(c => c.id == selectedCategory)?.categoryName || 'General',
    isSample: true
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
          <Typography color="primary.main" fontWeight="500">Inventory</Typography>
          <Typography color="text.primary" fontWeight="500">Procurement</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              Part Inward Log
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              Registry of all incoming spare parts, pending orders, and procurement history
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
            New Procurement
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Orders" value={incomes.length} icon={<HistoryIcon />} color="#1976d2" bg="linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Pending Orders" value={pendingIncomes.length} icon={<PendingIcon />} color="#ed6c02" bg="linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Fulfilled" value={incomes.filter(i => i.status === 'RECEIVED').length} icon={<ReceivedIcon />} color="#2e7d32" bg="linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Value" value={formatCurrency(incomes.reduce((a, b) => a + (b.totalAmount || 0), 0))} icon={<ChartIcon />} color="#9c27b0" bg="linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)" />
        </Grid>
      </Grid>

      {/* Analysis Section */}
      <Card sx={{ mb: 4, borderRadius: 3, border: '1px solid #eee' }} elevation={0}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: showChart ? 3 : 0 }}>
            <FormControl sx={{ minWidth: 250 }} size="small">
              <InputLabel>Procurement Category Analysis</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Procurement Category Analysis"
                sx={{ borderRadius: 2 }}
              >
                {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.categoryName}</MenuItem>)}
              </Select>
            </FormControl>
            <Button
              variant="outlined" startIcon={<ChartIcon />} onClick={handleFetchChartData}
              disabled={!selectedCategory || chartLoading}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
            >
              Analyze Trends
            </Button>
            {showChart && <IconButton onClick={() => setShowChart(false)}><CloseIcon /></IconButton>}
            <Box sx={{ flex: 1 }} />
            <IconButton onClick={fetchData} sx={{ border: '1px solid #eee' }}><RefreshIcon /></IconButton>
          </Box>

          {showChart && chartData && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 250, px: 2, pt: 4, pb: 2 }}>
                {chartData.labels.map((label, i) => {
                  const val = chartData.incomeData[i];
                  const max = Math.max(...chartData.incomeData);
                  const h = max > 0 ? (val / max) * 100 : 0;
                  return (
                    <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                      <Box sx={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Tooltip title={formatCurrency(val)}>
                          <Box sx={{
                            height: `${h}%`, width: '40%', borderRadius: '4px 4px 0 0',
                            background: 'linear-gradient(to top, #1976d2, #21CBF3)',
                            transition: 'all 0.3s', '&:hover': { transform: 'scaleX(1.1)', filter: 'brightness(1.1)' }
                          }} />
                        </Tooltip>
                      </Box>
                      <Typography variant="caption" sx={{ mt: 1, fontWeight: 'bold', color: 'text.secondary' }}>{label}</Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Main Table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }} elevation={3}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ px: 2, borderBottom: '1px solid #eee' }}>
          <Tab label={`Active Registry (${incomes.length})`} sx={{ textTransform: 'none', fontWeight: 'bold' }} />
          <Tab label={`Awaiting Receipt (${pendingIncomes.length})`} sx={{ textTransform: 'none', fontWeight: 'bold' }} />
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Doc #</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Partner Source</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Valuation</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(tabValue === 0 ? incomes : pendingIncomes).map((income) => (
                <TableRow key={income.id} hover>
                  <TableCell><Typography variant="body2" fontWeight="bold">{income.orderNumber}</Typography></TableCell>
                  <TableCell>{income.supplierName || '---'}</TableCell>
                  <TableCell>{formatDate(income.orderDate)}</TableCell>
                  <TableCell>{formatCurrency(income.totalAmount)}</TableCell>
                  <TableCell><Chip label={income.status} color={getStatusColor(income.status)} size="small" sx={{ fontWeight: 'bold' }} /></TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton size="small" color="primary" onClick={() => { setSelectedIncome(income); setOpenViewDialog(true); }} sx={{ bgcolor: 'primary.light', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}><ViewIcon fontSize="small" /></IconButton>
                      {income.status === 'PENDING' && (
                        <Tooltip title="Restock Inventory">
                          <IconButton size="small" color="success" onClick={() => handleReceiveIncome(income.id)} sx={{ bgcolor: 'success.light', color: 'white', '&:hover': { bgcolor: 'success.main' } }}><ReceiveIcon fontSize="small" /></IconButton>
                        </Tooltip>
                      )}
                      <IconButton size="small" color="error" onClick={() => { if (window.confirm('Erase this record?')) sparePartIncomeService.deleteIncome(income.id).then(fetchData) }} sx={{ bgcolor: 'error.light', color: 'white', '&:hover': { bgcolor: 'error.main' } }}><DeleteIcon fontSize="small" /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialogs & Snackbar */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">New Procurement Order</Typography>
          <IconButton onClick={() => setOpenDialog(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth label="Source Supplier" value={formData.supplierId} onChange={(e) => setFormData(p => ({ ...p, supplierId: e.target.value }))}>
                {suppliers.map(s => <MenuItem key={s.id} value={s.id}>{s.supplierName}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth type="date" label="Voucher Date" value={formData.orderDate} onChange={(e) => setFormData(p => ({ ...p, orderDate: e.target.value }))} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Internal Notes" value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} /></Grid>
            {formData.items.map((item, idx) => (
              <React.Fragment key={idx}>
                <Grid item xs={12} md={4}>
                  <TextField select fullWidth label="Part" value={item.sparePartId} onChange={(e) => handleItemChange(idx, 'sparePartId', e.target.value)}>
                    {spareParts.map(p => <MenuItem key={p.id} value={p.id}>{p.partCode} - {p.partName}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={6} md={2}><TextField fullWidth type="number" label="Qty" value={item.quantityOrdered} onChange={(e) => handleItemChange(idx, 'quantityOrdered', e.target.value)} /></Grid>
                <Grid item xs={6} md={3}><TextField fullWidth type="number" label="Unit Price" value={item.unitPrice} onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)} /></Grid>
                <Grid item xs={10} md={2}><TextField fullWidth label="Total" value={formatCurrency(item.totalPrice)} disabled /></Grid>
                <Grid item xs={2} md={1}>
                  <IconButton color="error" onClick={() => setFormData(p => ({ ...p, items: p.items.filter((_, i) => i !== idx) }))} disabled={formData.items.length === 1}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}><Button startIcon={<AddIcon />} onClick={() => setFormData(p => ({ ...p, items: [...p.items, { sparePartId: '', quantityOrdered: 1, unitPrice: 0, totalPrice: 0 }] }))}>Add Line Item</Button></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2, background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)' }}>Register Procurement</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Procurement # {selectedIncome?.orderNumber}</Typography>
          <IconButton onClick={() => setOpenViewDialog(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedIncome && (
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="textSecondary">Source Partner:</Typography><Typography fontWeight="bold">{selectedIncome.supplierName}</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="textSecondary">Registration Date:</Typography><Typography fontWeight="bold">{formatDate(selectedIncome.orderDate)}</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="textSecondary">Inventory Status:</Typography><Chip size="small" label={selectedIncome.status} color={getStatusColor(selectedIncome.status)} /></Box>
              <Divider />
              <Typography variant="subtitle2" color="primary">Invoiced Items</Typography>
              {selectedIncome.items?.map((it, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'rgba(0,0,0,0.02)', p: 1, borderRadius: 1 }}>
                  <Typography variant="body2">{it.partName} x {it.quantityOrdered}</Typography>
                  <Typography variant="body2" fontWeight="bold">{formatCurrency(it.totalPrice)}</Typography>
                </Box>
              ))}
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="h6">Total Valuation:</Typography><Typography variant="h6" color="primary">{formatCurrency(selectedIncome.totalAmount)}</Typography></Box>
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

export default IncomePage;