import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Divider
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  ConfirmationNumber as NumberIcon
} from '@mui/icons-material';

const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Chip
            label={vehicle.vehicleId}
            color="primary"
            size="small"
            variant="outlined"
          />
          <Chip
            label={vehicle.vehicleType}
            color="secondary"
            size="small"
            icon={<CarIcon fontSize="small" />}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <NumberIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" component="div">
            {vehicle.vehicleNumber}
          </Typography>
        </Box>

        <Typography variant="body1" gutterBottom>
          {vehicle.brand} {vehicle.model}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="textSecondary">
            Owner:
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight="medium" sx={{ ml: 3 }}>
          {vehicle.customer?.name || 'Unknown'}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ ml: 3 }}>
          {vehicle.customer?.phone || ''}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          size="small"
          color="primary"
          onClick={() => onEdit(vehicle)}
          fullWidth
          variant="outlined"
          sx={{ mr: 1 }}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => {
            if (window.confirm(`Delete vehicle "${vehicle.vehicleNumber}"?`)) {
              onDelete(vehicle.id);
            }
          }}
          fullWidth
          variant="outlined"
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default VehicleCard;