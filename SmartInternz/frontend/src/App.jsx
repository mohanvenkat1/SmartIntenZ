import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/common/Home';
import Login from './components/common/Login';
import SignUp from './components/common/SignUp';
import UserDashboard from './components/user/HomePage';
import Complaint from './components/user/Complaint';
import Status from './components/user/Status';
import AdminHome from './components/admin/AdminHome';
import AgentHome from './components/agent/AgentHome';
import NavBar from './components/common/NavBar';
import Footer from './components/common/Footer';
import About from './components/common/About';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <Router>
            <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <NavBar user={user} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Protected Routes */}
                    <Route path="/user/home" element={user && user.role === 'user' ? <UserDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
                    <Route path="/user/complaint" element={user && user.role === 'user' ? <Complaint user={user} /> : <Navigate to="/login" />} />
                    <Route path="/user/status" element={user && user.role === 'user' ? <Status user={user} /> : <Navigate to="/login" />} />

                    <Route path="/admin/home" element={user && user.role === 'admin' ? <AdminHome user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
                    <Route path="/agent/home" element={user && user.role === 'agent' ? <AgentHome user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
