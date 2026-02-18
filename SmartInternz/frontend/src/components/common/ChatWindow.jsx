import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import io from 'socket.io-client';
import axios from 'axios';
import { API_URL, BASE_URL } from '../../config';

const socket = io(BASE_URL);

const ChatWindow = ({ complaintId, userId }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [complaintData, setComplaintData] = useState(null);

    useEffect(() => {
        // Fetch initial chat history and complaint details
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get(`${API_URL}/complaints/${complaintId}`);
                setChatHistory(response.data.messages || []);
                setComplaintData(response.data);
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        };

        fetchChatHistory();

        socket.emit('join_complaint_room', complaintId);

        socket.on('receive_message', (data) => {
            setChatHistory((prev) => [...prev, data]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [complaintId]);

    const getSenderName = (senderId) => {
        if (senderId === userId) return "You";
        if (complaintData) {
            if (complaintData.userId && (complaintData.userId._id === senderId || complaintData.userId === senderId)) return complaintData.userId.name || "User";
            if (complaintData.agentId && (complaintData.agentId._id === senderId || complaintData.agentId === senderId)) return complaintData.agentId.name || "Agent";
        }
        return "Support"; // Fallback for Admin or others
    };

    const sendMessage = () => {
        if (message.trim()) {
            const msgData = {
                complaintId,
                senderId: userId,
                message,
                timestamp: new Date()
            };
            socket.emit('send_message', msgData);
            setMessage('');
        }
    };

    return (
        <Paper elevation={3} sx={{ height: 400, display: 'flex', flexDirection: 'column', p: 2 }}>
            <Typography variant="h6" gutterBottom>Chat</Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, border: '1px solid #eee', borderRadius: 2, p: 2 }}>
                <List>
                    {chatHistory.map((msg, index) => (
                        <ListItem key={index} alignItems="flex-start">
                            <ListItemText
                                primary={getSenderName(msg.senderId)}
                                secondary={msg.message}
                                sx={{ textAlign: msg.senderId === userId ? 'right' : 'left' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{ display: 'flex' }}>
                <TextField
                    fullWidth
                    size="small"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <Button variant="contained" onClick={sendMessage} sx={{ ml: 1 }}>Send</Button>
            </Box>
        </Paper>
    );
};

export default ChatWindow;
