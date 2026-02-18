require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { PORT, MONGO_URI, JWT_SECRET } = require('./config');
const { User, Complaint } = require('./Schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity in dev
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1); // Exit if DB connection fails
    });

// Socket.io for Real-time Chat
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_complaint_room', (complaintId) => {
        socket.join(complaintId);
        console.log(`User joined complaint room: ${complaintId}`);
    });

    socket.on('send_message', async (data) => {
        const { complaintId, senderId, message } = data;
        try {
            const complaint = await Complaint.findById(complaintId);
            if (complaint) {
                complaint.messages.push({ senderId, message });
                await complaint.save();
                io.to(complaintId).emit('receive_message', { senderId, message, timestamp: new Date() });
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Complaint Routes
app.post('/api/complaints', async (req, res) => {
    try {
        const { userId, title, description, category, priority } = req.body;
        const complaint = new Complaint({ userId, title, description, category, priority });
        await complaint.save();
        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/complaints', async (req, res) => {
    try {
        const { role, userId } = req.query; // role and userId passed as query params for simplicity
        let filter = {};
        if (role === 'user') {
            filter.userId = userId;
        } else if (role === 'agent') {
            filter.agentId = userId; // Show complaints assigned to this agent
        }
        // Admin sees all, or filter by status if needed

        const complaints = await Complaint.find(filter).populate('userId', 'name email').populate('agentId', 'name email');
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/complaints/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate('userId', 'name email').populate('agentId', 'name email');
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/complaints/:id', async (req, res) => {
    try {
        const updates = req.body;
        const complaint = await Complaint.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/complaints/:id/assign', async (req, res) => {
    try {
        const { agentId } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(req.params.id, { agentId, status: 'In Progress' }, { new: true });
        res.json(complaint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
