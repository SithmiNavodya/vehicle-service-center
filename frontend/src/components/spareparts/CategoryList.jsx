// src/components/spareparts/CategoryList.jsx
import React, { useState } from 'react';
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
  CircularProgress,
  TablePagination,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  Code as CodeIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const CategoryList = ({ categories, onEdit, onDelete, onSearch, onRefresh, loading }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const pagedCategories = categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading && categories.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
        <CircularProgress size={40} />
        <Typography color="textSecondary">Syncing category registry...</Typography>
      </Box>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Paper elevation={0} sx={{
        textAlign: 'center',
        py: 10,
        border: '1px dashed #ccc',
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.02)'
      }}>
        <CategoryIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>No Categories Defined</Typography>
        <Typography variant="body2" color="textSecondary">Start by creating a category to classify your spare parts</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Internal Search Bar for List */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #eee' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Filter categories by name or code..."
            value={searchTerm}
            onChange={handleSearch}
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
          <IconButton onClick={onRefresh} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Registry Code</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category Designation</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Last Modified</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedCategories.map((category) => (
              <TableRow
                key={category.id}
                hover
                sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' } }}
              >
                <TableCell>
                  <Chip
                    label={category.categoryCode}
                    size="small"
                    sx={{
                      fontWeight: 'bold',
                      borderRadius: 1,
                      backgroundColor: 'primary.light',
                      color: 'white'
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: 'secondary.light', width: 32, height: 32 }}>
                      <CategoryIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Typography variant="body2" fontWeight="700">
                      {category.categoryName}
                    </Typography>
                  </Stack>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Modify Category">
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(category)}
                        size="small"
                        sx={{ backgroundColor: 'primary.light', color: 'white', '&:hover': { backgroundColor: 'primary.main' } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove Record">
                      <IconButton
                        color="error"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete category "${category.categoryName}"?`)) {
                            onDelete(category.id);
                          }
                        }}
                        size="small"
                        sx={{ backgroundColor: 'error.light', color: 'white', '&:hover': { backgroundColor: 'error.main' } }}
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid #eee' }}
        />
      </TableContainer>
    </Box>
  );
};

export default CategoryList;
