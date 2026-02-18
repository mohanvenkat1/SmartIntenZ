import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, formData);
            onLogin(response.data.user);
            // Redirect based on role
            if (response.data.user.role === 'admin') navigate('/admin/home');
            else if (response.data.user.role === 'agent') navigate('/agent/home');
            else navigate('/user/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
            <Container maxWidth="xs">
                <Paper elevation={10} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#0d47a1', fontWeight: 'bold' }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                        Please login to your account
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2, bgcolor: '#0d47a1', '&:hover': { bgcolor: '#002171' } }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                        </Button>
                    </form>
                    <Button color="primary" onClick={() => navigate('/signup')}>
                        Don't have an account? Sign Up
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
