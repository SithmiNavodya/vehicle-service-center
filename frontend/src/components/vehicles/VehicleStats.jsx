import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Stack
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  Layers as ListIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';

const VehicleStats = ({ vehicles }) => {
  const totalVehicles = vehicles.length;

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
      title: 'TOTAL FLEET',
      value: totalVehicles,
      icon: <CarIcon />,
      color: '#1976d2',
      bg: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
    },
    {
      title: 'DIVERSITY',
      value: `${Object.keys(vehicleTypes).length} Types`,
      icon: <CategoryIcon />,
      color: '#00897b',
      bg: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)'
    },
    {
      title: 'DOMINANT CLASS',
      value: topType,
      icon: <ListIcon />,
      color: '#ed6c02',
      bg: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
    },
    {
      title: 'UNIQUE OWNERS',
      value: new Set(vehicles.map(v => v.customer?.id)).size,
      icon: <PeopleIcon />,
      color: '#8e24aa',
      bg: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'
    }
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              background: stat.bg,
              color: stat.color,
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
              <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, transform: 'rotate(15deg)', color: stat.color }}>
                {React.cloneElement(stat.icon, { sx: { fontSize: 80 } })}
              </Box>

              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 24 } })}
                  <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', mt: -0.5 }}>
                  {stat.value}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default VehicleStats;