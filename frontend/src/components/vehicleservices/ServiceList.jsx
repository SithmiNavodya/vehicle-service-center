import React from 'react';
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  Button
} from '@mui/material';
import ServiceCard from './ServiceCard';

const ServiceList = ({ services, onEdit, onDelete, loading, error }) => {
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 6;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', py: 8, gap: 2, alignItems: 'center' }}>
        <CircularProgress size={24} />
        <Typography color="textSecondary" fontWeight="500">Retrieving awesome services...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="body1">{error}</Typography>
      </Box>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10, border: '1px dashed #ccc', borderRadius: 4 }}>
        <Typography color="textSecondary" variant="h6">No Services Detected</Typography>
        <Typography variant="body2" color="textSecondary">Initiate a new service catalog to begin tracking metadata.</Typography>
      </Box>
    );
  }

  const displayedServices = services.slice(0, (page + 1) * rowsPerPage);

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={3}>
        {displayedServices.map((service) => (
          <Grid item xs={12} md={6} lg={4} key={service.id}>
            <ServiceCard
              service={service}
              onSelect={() => onEdit(service)}
            />
          </Grid>
        ))}
      </Grid>

      {services.length > displayedServices.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setPage(p => p + 1)}
            sx={{ borderRadius: 2, textTransform: 'none', px: 4, fontWeight: 'bold' }}
          >
            Explore More Services
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ServiceList;
