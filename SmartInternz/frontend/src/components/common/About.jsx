import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const About = () => {
    return (
        <Box sx={{ minHeight: '80vh', py: 8 }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 6, borderRadius: 4 }}>
                    <Typography variant="h3" gutterBottom color="primary" fontWeight="bold">About ResolveNow</Typography>
                    <Typography paragraph variant="h6" color="text.secondary">
                        ResolveNow is a state-of-the-art Online Complaint Registration and Management System designed to bridge the gap between organizations and their customers.
                    </Typography>
                    <Typography paragraph>
                        Our mission is to streamline the complaint resolution process, ensuring every voice is heard and every issue is addressed promptly. With our intuitive platform, users can easily file complaints, track their status in real-time, and communicate directly with assigned agents.
                    </Typography>
                    <Typography paragraph>
                        For organizations, ResolveNow provides powerful tools to manage workflows, analyze trends, and improve customer satisfaction. We believe in transparency, efficiency, and the power of effective communication.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default About;
