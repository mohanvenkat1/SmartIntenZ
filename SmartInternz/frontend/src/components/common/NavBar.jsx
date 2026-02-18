import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleDashboardClick = () => {
        if (user.role === 'admin') navigate('/admin/home');
        else if (user.role === 'agent') navigate('/agent/home');
        else navigate('/user/home');
    };

    return (
        <AppBar position="static" sx={{ bgcolor: 'white', color: 'black', boxShadow: 1 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#0d47a1', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    ResolveNow
                </Typography>
                {user ? (
                    <Box>
                        <Button color="inherit" onClick={handleDashboardClick}>Dashboard</Button>
                        <Button color="inherit" onClick={onLogout}>Logout</Button>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                        <Button variant="contained" sx={{ bgcolor: '#0d47a1', color: 'white', ml: 2 }} onClick={() => navigate('/signup')}>Sign Up</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
