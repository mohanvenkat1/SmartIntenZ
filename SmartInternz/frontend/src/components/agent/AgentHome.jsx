import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, Card, CardContent, CardActions, Chip, Select, MenuItem, Dialog, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../../config';
import ChatWindow from '../common/ChatWindow';

const AgentHome = ({ user, onLogout }) => {
    const [assignedComplaints, setAssignedComplaints] = useState([]);
    const [openChat, setOpenChat] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get(`${API_URL}/complaints?role=agent&userId=${user.id}`);
                setAssignedComplaints(response.data);
            } catch (error) {
                console.error("Error fetching agent complaints:", error);
            }
        };
        fetchComplaints();
    }, [user.id]);

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(`${API_URL}/complaints/${id}`, { status: newStatus });
            // Update local state
            setAssignedComplaints(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleOpenChat = (complaint) => {
        setSelectedComplaint(complaint);
        setOpenChat(true);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', p: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Typography variant="h4" color="primary" fontWeight="bold">Agent Dashboard</Typography>
                    <Button variant="contained" color="error" onClick={onLogout}>Logout</Button>
                </Box>

                <Typography variant="h5" gutterBottom>Assigned Tasks</Typography>

                {assignedComplaints.length === 0 ? (
                    <Typography>No complaints assigned yet.</Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {assignedComplaints.map((complaint) => (
                            <Card key={complaint._id} sx={{ width: 345, borderRadius: 3, boxShadow: 3 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography color="text.secondary" fontSize={14}>
                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                        </Typography>
                                        <Chip label={complaint.priority} color={complaint.priority === 'High' ? 'error' : 'default'} size="small" />
                                    </Box>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {complaint.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {complaint.description}
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        Status: {complaint.status}
                                    </Typography>
                                    <Select
                                        fullWidth
                                        size="small"
                                        value={complaint.status}
                                        onChange={(e) => updateStatus(complaint._id, e.target.value)}
                                        sx={{ mt: 2 }}
                                    >
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Resolved">Resolved</MenuItem>
                                        <MenuItem value="Closed">Closed</MenuItem>
                                    </Select>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => handleOpenChat(complaint)}>Message User</Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                )}

                <Dialog open={openChat} onClose={() => setOpenChat(false)} maxWidth="sm" fullWidth>
                    <DialogContent>
                        {selectedComplaint && <ChatWindow complaintId={selectedComplaint._id} userId={user.id} />}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenChat(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

            </Container>
        </Box>
    );
};

export default AgentHome;
