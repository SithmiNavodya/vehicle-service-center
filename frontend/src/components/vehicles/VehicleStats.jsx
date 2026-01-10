import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  List as ListIcon
} from '@mui/icons-material';

const VehicleStats = ({ vehicles }) => {
  const totalVehicles = vehicles.length;

  // Count vehicles by type
  const vehicleTypes = vehicles.reduce((acc, vehicle) => {
    const type = vehicle.vehicleType || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const topType = Object.keys(vehicleTypes).reduce((a, b) =>
    vehicleTypes[a] > vehicleTypes[b] ? a : b, 'N/A'
  );

  const stats = [
    {
      title: 'Total Vehicles',
      value: totalVehicles,
      icon: <CarIcon fontSize="large" />,
      color: 'primary.main'
    },
    {
      title: 'Vehicle Types',
      value: Object.keys(vehicleTypes).length,
      icon: <CategoryIcon fontSize="large" />,
      color: 'success.main'
    },
    {
      title: 'Most Common',
      value: topType,
      icon: <ListIcon fontSize="large" />,
      color: 'warning.main'
    },
    {
      title: 'Unique Owners',
      value: new Set(vehicles.map(v => v.customer?.id)).size,
      icon: <PeopleIcon fontSize="large" />,
      color: 'info.main'
    }
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="body2" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {stat.value}
                  </Typography>
                </Box>
                <Box sx={{ color: stat.color }}>
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default VehicleStats;