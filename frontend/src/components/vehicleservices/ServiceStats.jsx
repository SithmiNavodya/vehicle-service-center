import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box
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

  const stats = [
    {
      title: 'Total Services',
      value: totalServices,
      icon: <ListIcon fontSize="large" />,
      color: 'primary.main'
    },
    {
      title: 'Avg. Price',
      value: `$${avgPrice.toFixed(2)}`,
      icon: <MoneyIcon fontSize="large" />,
      color: 'success.main'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: <TrendingIcon fontSize="large" />,
      color: 'warning.main'
    },
    {
      title: 'Services',
      value: totalServices,
      icon: <TimeIcon fontSize="large" />,
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
                  <Typography variant="h4" component="div">
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

export default ServiceStats;