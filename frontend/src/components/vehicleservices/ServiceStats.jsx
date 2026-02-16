import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Stack
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  List as ListIcon,
  Schedule as TimeIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';

const ServiceStats = ({ services }) => {
  const totalServices = services.length;
  const avgPrice = services.length > 0
    ? services.reduce((sum, service) => sum + parseFloat(service.price || 0), 0) / services.length
    : 0;

  const totalRevenue = services.reduce((sum, service) => sum + parseFloat(service.price || 0), 0);

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
            <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', mt: -0.5 }}>
            {value}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', opacity: 0.8 }}>
            Operational metrics
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  const stats = [
    {
      title: 'Active Catalog',
      value: totalServices,
      icon: <ListIcon />,
      color: '#1976d2',
      bg: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
    },
    {
      title: 'Market Value',
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: <TrendingIcon />,
      color: '#ed6c02',
      bg: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
    },
    {
      title: 'Avg Pricing',
      value: `Rs. ${avgPrice.toLocaleString()}`,
      icon: <MoneyIcon />,
      color: '#2e7d32',
      bg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
    },
    {
      title: 'Engagements',
      value: totalServices,
      icon: <TimeIcon />,
      color: '#607d8b',
      bg: 'linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%)'
    }
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ServiceStats;