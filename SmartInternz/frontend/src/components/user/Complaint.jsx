import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, MenuItem, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';

const Complaint = ({ user }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'Medium'
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const categories = ['Product Defect', 'Service Issue', 'Billing', 'Technical Support', 'Other'];
    const priorities = ['Low', 'Medium', 'High'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/complaints`, {
                ...formData,
                userId: user.id
            });
            setSubmitted(true);
            setTimeout(() => navigate('/user/status'), 2000); // Redirect after 2s
        } catch (err) {
            setError('Failed to submit complaint. Please try again.');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', py: 4 }}>
            <Container maxWidth="md">
                <Button onClick={() => navigate('/user/home')} sx={{ mb: 2 }}>&larr; Back to Dashboard</Button>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom>File a Complaint</Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Please provide detailed information about your issue to help us resolve it quickly.
                    </Typography>

                    {submitted && <Alert severity="success" sx={{ mb: 2 }}>Complaint submitted successfully! Redirecting...</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Complaint Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    {categories.map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    {priorities.map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    label="Description of the Issue"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" size="large" type="submit">Submit Complaint</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Complaint;
