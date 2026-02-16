import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  Stack,
  Avatar
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  ConfirmationNumber as NumberIcon,
  Build as BuildIcon,
  ChevronRight as ArrowIcon
} from '@mui/icons-material';

const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        border: '1px solid #eef2f6',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
          borderColor: 'primary.light'
        }
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Chip
            label={`V_${(vehicle.vehicleId || vehicle.id).toString().replace(/^V[-_]/, '')}`}
            sx={{
              fontWeight: 800,
              borderRadius: 1.5,
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              color: 'primary.main',
              fontSize: '0.7rem',
              border: '1px solid rgba(25, 118, 210, 0.2)'
            }}
          />
          <Chip
            label={vehicle.vehicleType}
            size="small"
            icon={<CarIcon sx={{ fontSize: '1rem !important', color: 'primary.main' }} />}
            sx={{
              borderRadius: 1.5,
              fontWeight: 700,
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              fontSize: '0.7rem'
            }}
          />
        </Box>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(25,118,210,0.1)', color: 'primary.main', width: 48, height: 48 }}>
            <CarIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2 }}>
              {vehicle.vehicleNumber}
            </Typography>
            <Typography variant="body2" color="textSecondary" fontWeight="500">
              {vehicle.brand} {vehicle.model}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2, opacity: 0.6 }} />

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.light', fontSize: '0.75rem' }}>
              <PersonIcon sx={{ fontSize: '1.1rem' }} />
            </Avatar>
            <Box>
              <Typography variant="caption" color="textSecondary" display="block">Legal Owner</Typography>
              <Typography variant="body2" fontWeight="700">{vehicle.customer?.name || 'Unassigned'}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: 'info.light', fontSize: '0.75rem' }}>
              <BuildIcon sx={{ fontSize: '1rem' }} />
            </Avatar>
            <Box>
              <Typography variant="caption" color="textSecondary" display="block">Registry Group</Typography>
              <Typography variant="body2" fontWeight="700">Premium Fleet</Typography>
            </Box>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ mt: 'auto', p: 3, pt: 1 }}>
        <Stack direction="row" spacing={1.5}>
          <Button
            size="small"
            onClick={() => onEdit(vehicle)}
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
          >
            Modify
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => {
              if (window.confirm(`Permanently decommission vehicle "${vehicle.vehicleNumber}"?`)) {
                onDelete(vehicle.id);
              }
            }}
            fullWidth
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              bgcolor: 'error.main',
              boxShadow: 'none'
            }}
          >
            Archive
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default VehicleCard;