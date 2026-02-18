# ResolveNow - Online Complaint Registration System

## Prerequisites

You must have **Node.js** installed.
If you see errors like `'node' is not recognized` or `'npm' is not recognized`, it means Node.js is not in your system PATH yet.

**Fix:**
1. Restart VS Code (close all windows and open again).
2. If that doesn't work, restart your computer.

## How to Run

### 1. Start the Backend
Open a terminal in the `backend` folder:
```bash
cd backend
npm start
```
Server will run on: `http://localhost:5000`

### 2. Start the Frontend
Open a new terminal in the `frontend` folder:
```bash
cd frontend
npm run dev
```
App will run on: `http://localhost:5173`

## Login Credentials (Test)
You can sign up a new user, or use the database directly.
- **Admin**: Sign up with role 'admin'
- **Agent**: Sign up with role 'agent'
- **User**: Sign up with role 'user'
