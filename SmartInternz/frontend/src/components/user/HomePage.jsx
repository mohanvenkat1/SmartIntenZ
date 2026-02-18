import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Paper, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import axios from 'axios';
import { API_URL } from '../../config';

const HomePage = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
    const [recentComplaints, setRecentComplaints] = useState([]);

    useEffect(() => {
        // Fetch stats and recent complaints
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/complaints?role=user&userId=${user.id}`);
                const complaints = response.data;
                setStats({
                    total: complaints.length,
                    pending: complaints.filter(c => c.status === 'Pending').length,
                    resolved: complaints.filter(c => c.status === 'Resolved').length
                });
                setRecentComplaints(complaints.slice(0, 5));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [user.id]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            {/* Navbar handled in App.jsx */}

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>Welcome, {user.name}</Typography>

                <Grid container spacing={3}>
                    {/* Stats Cards */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140, bgcolor: '#e3f2fd', color: '#0d47a1' }}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>Total Complaints</Typography>
                            <Typography component="p" variant="h3">{stats.total}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140, bgcolor: '#fff3e0', color: '#e65100' }}>
                            <Typography component="h2" variant="h6" color="warning.main" gutterBottom>Pending</Typography>
                            <Typography component="p" variant="h3">{stats.pending}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140, bgcolor: '#e8f5e9', color: '#1b5e20' }}>
                            <Typography component="h2" variant="h6" color="success.main" gutterBottom>Resolved</Typography>
                            <Typography component="p" variant="h3">{stats.resolved}</Typography>
                        </Paper>
                    </Grid>

                    {/* Quick Actions */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={<AddCircleOutlineIcon />}
                                size="large"
                                onClick={() => navigate('/user/complaint')}
                            >
                                File New Complaint
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<AssessmentIcon />}
                                size="large"
                                onClick={() => navigate('/user/status')}
                            >
                                View All Status
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Recent Activity */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>Recent Complaints</Typography>
                            <List>
                                {recentComplaints.length > 0 ? recentComplaints.map((complaint) => (
                                    <React.Fragment key={complaint._id}>
                                        <ListItem button onClick={() => navigate('/user/status')}>
                                            <ListItemText
                                                primary={complaint.title}
                                                secondary={`Status: ${complaint.status} | Date: ${new Date(complaint.createdAt).toLocaleDateString()}`}
                                            />
                                            <Typography variant="body2" color={
                                                complaint.status === 'Resolved' ? 'success.main' :
                                                    complaint.status === 'Pending' ? 'warning.main' : 'text.secondary'
                                            }>
                                                {complaint.status}
                                            </Typography>
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                )) : (
                                    <Typography variant="body2" sx={{ p: 2 }}>No recent complaints found.</Typography>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;
