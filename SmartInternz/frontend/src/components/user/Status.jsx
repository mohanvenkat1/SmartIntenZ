import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Chip, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatWindow from '../common/ChatWindow';
import { API_URL } from '../../config';

const Status = ({ user }) => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [openChat, setOpenChat] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const handleOpenChat = (complaint) => {
        setSelectedComplaint(complaint);
        setOpenChat(true);
    };

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get(`${API_URL}/complaints?role=user&userId=${user.id}`);
                setComplaints(response.data);
            } catch (error) {
                console.error("Error fetching complaints:", error);
            }
        };
        fetchComplaints();
    }, [user.id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'success';
            case 'In Progress': return 'info';
            case 'Pending': return 'warning';
            case 'Closed': return 'default';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', py: 4 }}>
            <Container maxWidth="lg">
                <Button onClick={() => navigate('/user/home')} sx={{ mb: 2 }}>&larr; Back to Dashboard</Button>
                <Typography variant="h4" gutterBottom>My Complaints Status</Typography>

                {complaints.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography>You haven't submitted any complaints yet.</Typography>
                    </Paper>
                ) : (
                    complaints.map((complaint) => (
                        <Accordion key={complaint._id} sx={{ mb: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', pr: 2 }}>
                                    <Typography variant="h6">{complaint.title}</Typography>
                                    <Chip label={complaint.status} color={getStatusColor(complaint.status)} size="small" />
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="subtitle2" color="text.secondary">Category: {complaint.category}</Typography>
                                <Typography variant="subtitle2" color="text.secondary">Date: {new Date(complaint.createdAt).toLocaleString()}</Typography>
                                {complaint.agentId && <Typography variant="subtitle2" color="info.main">Assigned Agent: {complaint.agentId.name} ({complaint.agentId.email})</Typography>}
                                <Typography paragraph sx={{ mt: 2 }}>{complaint.description}</Typography>

                                <Button variant="outlined" size="small" onClick={() => handleOpenChat(complaint)}>View Details & Chat</Button>
                            </AccordionDetails>
                        </Accordion>
                    ))
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

export default Status;
