import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Chip,
    Divider,
    Stack,
    Avatar
} from '@mui/material';
import {
    Schedule as ScheduleIcon,
    Payments as MoneyIcon,
    Build as ServiceIcon,
    ChevronRight as ArrowIcon,
    Star as PremiumIcon
} from '@mui/icons-material';

const ServiceCard = ({ service, onSelect }) => {
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
                        label={service.serviceId}
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
                        label="Premium"
                        size="small"
                        icon={<PremiumIcon sx={{ fontSize: '1rem !important', color: '#ed6c02' }} />}
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 700,
                            backgroundColor: 'rgba(237, 108, 2, 0.1)',
                            color: '#ed6c02',
                            border: '1px solid rgba(237, 108, 2, 0.2)',
                            fontSize: '0.7rem'
                        }}
                    />
                </Box>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(25,118,210,0.1)', color: 'primary.main', width: 48, height: 48 }}>
                        <ServiceIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2 }}>
                            {service.serviceName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" fontWeight="500">
                            Professional Maintenance
                        </Typography>
                    </Box>
                </Stack>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: 40, lineHeight: 1.6 }}>
                    {service.description || 'Professional vehicle service tailored for optimal machine performance and longevity.'}
                </Typography>

                <Divider sx={{ my: 2, opacity: 0.6 }} />

                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'success.light', fontSize: '0.75rem' }}>
                            <MoneyIcon sx={{ fontSize: '1.1rem' }} />
                        </Avatar>
                        <Box>
                            <Typography variant="caption" color="textSecondary" display="block">Service Value</Typography>
                            <Typography variant="body2" fontWeight="700">Rs. {parseFloat(service.price).toLocaleString()}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.light', fontSize: '0.75rem' }}>
                            <ScheduleIcon sx={{ fontSize: '1rem' }} />
                        </Avatar>
                        <Box>
                            <Typography variant="caption" color="textSecondary" display="block">Estimated Duration</Typography>
                            <Typography variant="body2" fontWeight="700">{service.estimatedTime}</Typography>
                        </Box>
                    </Box>
                </Stack>
            </Box>

            <Box sx={{ mt: 'auto', p: 3, pt: 1 }}>
                <Button
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowIcon />}
                    onClick={() => onSelect && onSelect(service)}
                    sx={{
                        borderRadius: 2.5,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        boxShadow: 'none',
                        background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                    }}
                >
                    Engineer Service
                </Button>
            </Box>
        </Card>
    );
};

export default ServiceCard;
