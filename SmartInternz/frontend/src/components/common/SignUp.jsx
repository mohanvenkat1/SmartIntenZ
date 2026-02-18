import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
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
                        Create Account
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                        Join ResolveNow today
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            variant="outlined"
                            margin="normal"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
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
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            select
                            fullWidth
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            variant="outlined"
                            margin="normal"
                            required
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="user">User</option>
                            <option value="agent">Agent</option>
                            <option value="admin">Admin</option>
                        </TextField>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2, bgcolor: '#0d47a1', '&:hover': { bgcolor: '#002171' } }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                        </Button>
                    </form>
                    <Button color="primary" onClick={() => navigate('/login')}>
                        Already have an account? Login
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default SignUp;
