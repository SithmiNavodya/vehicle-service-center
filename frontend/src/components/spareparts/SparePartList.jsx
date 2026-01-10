// src/components/spareparts/SparePartList.jsx
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Box,
  Tooltip,
  Avatar,
  Divider,
  Badge,
  LinearProgress,
   Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as LocalShippingIcon,
  Category as CategoryIcon,
  Numbers as NumbersIcon,
  AttachMoney as AttachMoneyIcon,
  Store as StoreIcon
} from '@mui/icons-material';

const SparePartList = ({
  spareParts,
  onEdit,
  onDelete,
  onUse,
  loading = false
}) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading spare parts...</Typography>
      </Box>
    );
  }

  if (spareParts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <InventoryIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          No spare parts found
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Add your first spare part to get started
        </Typography>
      </Box>
    );
  }

  // Format price
  const formatPrice = (price) => {
    return `Rs. ${price?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) || '0.00'}`;
  };

  // Get stock status with progress
  const getStockStatus = (quantity, minQuantity) => {
    const percentage = (quantity / (minQuantity * 3)) * 100;

    if (quantity <= minQuantity) {
      return {
        label: 'Low Stock',
        color: 'error',
        icon: <WarningIcon />,
        percentage: Math.min(percentage, 100)
      };
    } else if (quantity <= minQuantity * 2) {
      return {
        label: 'Medium Stock',
        color: 'warning',
        icon: null,
        percentage: Math.min(percentage, 100)
      };
    } else {
      return {
        label: 'In Stock',
        color: 'success',
        icon: <CheckCircleIcon />,
        percentage: Math.min(percentage, 100)
      };
    }
  };

  // Get category info
  const getCategoryInfo = (part) => {
    if (part.category) {
      return {
        code: part.category.categoryCode || `CAT-${part.category.id}`,
        name: part.category.categoryName || 'Unnamed Category',
        id: part.category.id
      };
    }

    if (part.categoryCode && part.categoryName) {
      return {
        code: part.categoryCode,
        name: part.categoryName,
        id: part.categoryId
      };
    }

    return {
      code: part.categoryId ? `CAT-${part.categoryId}` : 'N/A',
      name: 'No Category',
      id: null
    };
  };

  // Get supplier info
  const getSupplierInfo = (part) => {
    if (part.supplier) {
      return {
        code: part.supplier.supplierCode || `SUP-${part.supplier.id}`,
        name: part.supplier.supplierName || 'Unknown Supplier'
      };
    }

    if (part.supplierCode && part.supplierName) {
      return {
        code: part.supplierCode,
        name: part.supplierName
      };
    }

    return {
      code: 'N/A',
      name: 'No Supplier'
    };
  };

  // Calculate stock progress color
  const getProgressColor = (percentage) => {
    if (percentage < 33) return 'error';
    if (percentage < 66) return 'warning';
    return 'success';
  };

  return (
    <Grid container spacing={3}>
      {spareParts.map((part) => {
        const stockStatus = getStockStatus(part.quantity, part.minQuantity);
        const categoryInfo = getCategoryInfo(part);
        const supplierInfo = getSupplierInfo(part);
        const totalValue = part.price * part.quantity;

        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={part.id}>
            <Card elevation={2} sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}>
              {/* Card Header with Part Number */}
              <Box sx={{
                p: 2,
                bgcolor: 'primary.main',
                color: 'white',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NumbersIcon fontSize="small" />
                    <Typography variant="h6" fontWeight="bold">
                      {part.partCode}
                    </Typography>
                  </Box>
                  <Chip
                    label={stockStatus.label}
                    size="small"
                    sx={{
                      bgcolor: 'white',
                      color: `${stockStatus.color}.main`,
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                {/* Part Name */}
                <Typography variant="h6" gutterBottom sx={{
                  fontWeight: 600,
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {part.partName}
                </Typography>

                {/* Brand & Model */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <InventoryIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="textSecondary">
                    {part.brand || 'No Brand'} • {part.model || 'No Model'}
                  </Typography>
                </Box>

                {/* Category Display with Number */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    mb: 2,
                    bgcolor: 'primary.light',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{
                      bgcolor: 'primary.main',
                      width: 36,
                      height: 36,
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      {categoryInfo.code?.replace('CAT-', '') || 'N/A'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                        Category
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight="medium">
                          {categoryInfo.name}
                        </Typography>
                        <Chip
                          label={categoryInfo.code}
                          size="small"
                          color="primary"
                          sx={{
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                {/* Supplier Info */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  p: 1,
                  bgcolor: 'action.hover',
                  borderRadius: 1
                }}>
                  <StoreIcon fontSize="small" color="action" />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Supplier
                    </Typography>
                    <Typography variant="body2">
                      {supplierInfo.name} ({supplierInfo.code})
                    </Typography>
                  </Box>
                </Box>

                {/* Stock Progress */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      Stock Level
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {part.quantity} / {part.minQuantity * 3}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stockStatus.percentage}
                    color={getProgressColor(stockStatus.percentage)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption">
                      Current: <strong>{part.quantity}</strong>
                    </Typography>
                    <Typography variant="caption">
                      Min: <strong>{part.minQuantity}</strong>
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Price Information */}
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Unit Price
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {formatPrice(part.price)}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Total Value
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {formatPrice(totalValue)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>

              {/* Actions */}
              <CardActions sx={{
                justifyContent: 'space-between',
                p: 2,
                pt: 0,
                mt: 'auto'
              }}>
                <Box>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(part)}
                      sx={{
                        border: '1px solid',
                        borderColor: 'primary.main',
                        mr: 1,
                        color: 'primary.main'
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(part.id)}
                      sx={{
                        border: '1px solid',
                        borderColor: 'error.light'
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                {onUse && (
                  <Tooltip title="Use in Service">
                    <IconButton
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={() => onUse(part)}
                      sx={{
                        bgcolor: 'secondary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'secondary.dark'
                        }
                      }}
                    >
                      <LocalShippingIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default SparePartList;