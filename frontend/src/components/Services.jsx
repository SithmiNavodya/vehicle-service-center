import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    Stack
} from '@mui/material';
import ServiceCard from './vehicleservices/ServiceCard';
import { Build as ToolIcon, Star as StarIcon } from '@mui/icons-material';

const Services = ({ services, onServiceClick }) => {
    // Take up to 6 services for the preview section
    const displayServices = services?.slice(0, 6) || [];

    return (
        <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
            <Container maxWidth="lg">
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 5 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <ToolIcon color="primary" sx={{ fontSize: 20 }} />
                            <Typography variant="overline" fontWeight="bold" color="primary" letterSpacing={2}>
                                PREMIUM CARE
                            </Typography>
                        </Box>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Our Expert <span style={{ color: '#1976d2' }}>Services</span>
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 600 }}>
                            Discover our wide range of professional vehicle services designed to keep your machine running at its peak performance.
                        </Typography>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Button variant="outlined" sx={{ borderRadius: 2 }}>
                            View All Services
                        </Button>
                    </Box>
                </Stack>

                <Grid container spacing={4}>
                    {displayServices.map((service) => (
                        <Grid item key={service.id} xs={12} sm={6} md={4}>
                            <ServiceCard service={service} onSelect={onServiceClick} />
                        </Grid>
                    ))}

                    {displayServices.length === 0 && (
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 10,
                                    backgroundColor: 'white',
                                    borderRadius: 4,
                                    border: '1px dashed #ccc'
                                }}
                            >
                                <StarIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                <Typography color="textSecondary">No premium services listed yet.</Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default Services;
