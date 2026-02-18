import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, TextField } from '@mui/material';
import axios from 'axios';
import { API_URL, BASE_URL } from '../../config';
import ChatWindow from '../common/ChatWindow';
import io from 'socket.io-client';

const socket = io(BASE_URL);

const AdminHome = ({ user, onLogout }) => { // user prop is the admin
    const [complaints, setComplaints] = useState([]);
    const [agents, setAgents] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [complaintsRes, usersRes] = await Promise.all([
                axios.get(`${API_URL}/complaints`),
                axios.get(`${API_URL}/users`)
            ]);
            setComplaints(complaintsRes.data);
            setAgents(usersRes.data.filter(u => u.role === 'agent'));
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    };

    const handleAssignClick = (complaint) => {
        setSelectedComplaint(complaint);
        setOpenDialog(true);
    };

    const handleAssignSubmit = async () => {
        try {
            await axios.put(`${API_URL}/complaints/${selectedComplaint._id}/assign`, {
                agentId: selectedAgent
            });
            setOpenDialog(false);
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Error assigning agent:", error);
        }
    };

    const [selectedIds, setSelectedIds] = useState([]);
    const [openChatDialog, setOpenChatDialog] = useState(false);
    const [chatComplaintId, setChatComplaintId] = useState(null);
    const [openBulkDialog, setOpenBulkDialog] = useState(false);
    const [bulkMessage, setBulkMessage] = useState('');

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedIds(complaints.map((c) => c._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (event, id) => {
        if (event.target.checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((item) => item !== id));
        }
    };

    const handleOpenChat = (complaint) => {
        setChatComplaintId(complaint._id);
        setOpenChatDialog(true);
    };

    const handleBulkSubmit = async () => {
        if (!bulkMessage.trim()) return;

        selectedIds.forEach(id => {
            socket.emit('send_message', {
                complaintId: id,
                senderId: user.id,
                message: bulkMessage,
                timestamp: new Date()
            });
        });

        alert(`Message sent to ${selectedIds.length} users.`);
        setBulkMessage('');
        setOpenBulkDialog(false);
        setSelectedIds([]);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f9', p: 4 }}>
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold">Admin Dashboard</Typography>
                    <Box>
                        {selectedIds.length > 0 && (
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ mr: 2 }}
                                onClick={() => setOpenBulkDialog(true)}
                            >
                                Message Selected ({selectedIds.length})
                            </Button>
                        )}
                        <Button variant="contained" color="error" onClick={onLogout}>Logout</Button>
                    </Box>
                </Box>

                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selectedIds.length > 0 && selectedIds.length < complaints.length}
                                        checked={complaints.length > 0 && selectedIds.length === complaints.length}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>User</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Assigned Agent</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {complaints.map((complaint) => (
                                <TableRow key={complaint._id} hover selected={selectedIds.includes(complaint._id)}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedIds.includes(complaint._id)}
                                            onChange={(event) => handleSelectOne(event, complaint._id)}
                                        />
                                    </TableCell>
                                    <TableCell>{complaint._id.substring(0, 8)}...</TableCell>
                                    <TableCell>{complaint.title}</TableCell>
                                    <TableCell>{complaint.userId?.name || 'Unknown'}</TableCell>
                                    <TableCell>
                                        <Box sx={{
                                            color: complaint.status === 'Resolved' ? 'green' :
                                                complaint.status === 'Pending' ? 'orange' : 'blue',
                                            fontWeight: 'bold'
                                        }}>
                                            {complaint.status}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{complaint.agentId?.name || 'Unassigned'}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" size="small" onClick={() => handleAssignClick(complaint)} sx={{ mr: 1 }}>
                                            Assign
                                        </Button>
                                        <Button variant="contained" size="small" onClick={() => handleOpenChat(complaint)}>
                                            Chat
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

                {/* Assign Agent Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Assign Agent</DialogTitle>
                    <DialogContent>
                        <Select
                            fullWidth
                            value={selectedAgent}
                            onChange={(e) => setSelectedAgent(e.target.value)}
                            displayEmpty
                            sx={{ mt: 2 }}
                        >
                            <MenuItem value="" disabled>Select Agent</MenuItem>
                            {agents.map(agent => (
                                <MenuItem key={agent._id} value={agent._id}>{agent.name}</MenuItem>
                            ))}
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleAssignSubmit} variant="contained">Assign</Button>
                    </DialogActions>
                </Dialog>

                {/* Chat Dialog */}
                <Dialog open={openChatDialog} onClose={() => setOpenChatDialog(false)} maxWidth="sm" fullWidth>
                    <DialogContent>
                        {chatComplaintId && <ChatWindow complaintId={chatComplaintId} userId={user.id} />}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenChatDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Bulk Message Dialog */}
                <Dialog open={openBulkDialog} onClose={() => setOpenBulkDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Message Selected Users</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Message"
                            fullWidth
                            multiline
                            rows={4}
                            value={bulkMessage}
                            onChange={(e) => setBulkMessage(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenBulkDialog(false)}>Cancel</Button>
                        <Button onClick={handleBulkSubmit} variant="contained">Send to {selectedIds.length} Users</Button>
                    </DialogActions>
                </Dialog>

            </Container>
        </Box>
    );
};

export default AdminHome;
