import React from 'react';
import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const Home = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', background: 'linear-gradient(135deg, #0d47a1 30%, #42a5f5 90%)', color: 'white' }}>
            <Container maxWidth="lg" sx={{ pt: 10, pb: 10 }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            ResolveNow
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                            Experience the future of complaint resolution. Fast, transparent, and secure.
                        </Typography>
                        <Box>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ mr: 2, bgcolor: 'secondary.main', color: 'white', px: 4, py: 1.5 }}
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{ color: 'white', borderColor: 'white', px: 4, py: 1.5 }}
                                onClick={() => navigate('/signup')}
                            >
                                Sign Up
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src="https://illustrations.popsy.co/amber/customer-support.svg"
                            alt="Support Illustration"
                            sx={{ width: '100%', maxWidth: 500, filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.2))' }}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={4} sx={{ mt: 10 }}>
                    {[
                        { icon: <SpeedIcon fontSize="large" />, title: "Fast Resolution", desc: "Get your issues resolved in record time with our streamlined process." },
                        { icon: <SecurityIcon fontSize="large" />, title: "Secure & Private", desc: "Your data is encrypted and protected with enterprise-grade security." },
                        { icon: <SupportAgentIcon fontSize="large" />, title: "24/7 Support", desc: "Our dedicated agents are always available to assist you." }
                    ].map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper elevation={3} sx={{ p: 4, borderRadius: 4, height: '100%', bgcolor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', color: 'white' }}>
                                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                <Typography variant="h6" gutterBottom fontWeight="bold">{feature.title}</Typography>
                                <Typography variant="body1" sx={{ opacity: 0.8 }}>{feature.desc}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;
