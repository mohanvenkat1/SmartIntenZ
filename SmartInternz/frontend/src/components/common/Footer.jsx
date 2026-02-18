import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
    return (
        <Box component="footer" sx={{ bgcolor: '#0d47a1', color: 'white', py: 6, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">ResolveNow</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Empowering voices, resolving issues. Your trusted platform for complaint management.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Quick Links</Typography>
                        <Link href="/" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>Home</Link>
                        <Link href="/about" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>About Us</Link>
                        <Link href="/contact" color="inherit" underline="hover" sx={{ display: 'block' }}>Contact</Link>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Connect</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            support@resolvenow.com<br />
                            +1 (555) 123-4567
                        </Typography>
                    </Grid>
                </Grid>
                <Box mt={5} textAlign="center">
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        &copy; {new Date().getFullYear()} ResolveNow. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
