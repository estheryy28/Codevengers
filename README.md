# Codevengers - Code Debugging Quiz System

A LAN-based competitive programming quiz system where participants debug code challenges.

---

## 📋 Requirements

### System Requirements
| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | v18+ or v20+ | Runtime for frontend & backend |
| **MongoDB** | v6.0+ | Database |
| **npm** | v9+ | Package manager (comes with Node.js) |

### Optional (for code execution)
| Software | Purpose |
|----------|---------|
| **GCC/G++** | C/C++ code compilation |
| **Python 3** | Python code execution |
| **JDK** | Java code compilation |

---

## 🚀 Quick Start

### Step 1: Install Prerequisites

**Windows:**
1. Download and install [Node.js](https://nodejs.org/) (LTS version)
2. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
3. Start MongoDB service

**Verify installation:**
```bash
node --version   # Should show v18+ or v20+
npm --version    # Should show v9+
mongod --version # Should show v6+
```

### Step 2: Clone/Copy the Project

Copy the entire `quiz-system` folder to your system.

### Step 3: Install Dependencies

**Backend:**
```bash
cd quiz-system/backend
npm install
```

**Frontend:**
```bash
cd quiz-system/frontend
npm install
```

### Step 4: Configure Environment

Create or edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quiz_system
JWT_SECRET=your_secure_secret_key_here
```

> ⚠️ **Important:** Change `JWT_SECRET` to a secure random string in production!

### Step 5: Seed the Database (First Time Only)

```bash
cd quiz-system/backend
npm run seed
```

This creates:
- Admin account: `admin` / `admin123`
- Sample code challenges

### Step 6: Start the Application

**Terminal 1 - Backend:**
```bash
cd quiz-system/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd quiz-system/frontend
npm run dev
```

### Step 7: Access the Application

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Main application |
| http://localhost:3000/login | User login |
| http://localhost:3000/admin | Admin dashboard |

---

## 🌐 LAN Access Setup

To allow other devices on your network to access the quiz:

### Step 1: Find Your IP Address

**Windows:**
```powershell
ipconfig
```
Look for **IPv4 Address** (e.g., `192.168.1.100`)

### Step 2: Allow Through Firewall

When you start the servers, Windows will prompt to allow access.
Click **"Allow access"** for private networks.

**Manual Firewall Setup (if not prompted):**
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Add Node.js and allow for Private networks

### Step 3: Access from Other Devices

Other devices on the same network can access:
```
http://YOUR_IP:3000
```
Example: `http://192.168.1.100:3000`

---

## 👤 Default Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |

> Create regular user accounts through the Register page.

---

## 📁 Project Structure

```
quiz-system/
├── backend/
│   ├── config/         # Database configuration
│   ├── middleware/     # Authentication & validation
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   ├── seeds/          # Database seeders
│   ├── server.js       # Main server file
│   ├── .env            # Environment variables
│   └── package.json    # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── context/    # Auth context
│   │   └── main.tsx    # Entry point
│   ├── vite.config.ts  # Vite configuration
│   └── package.json    # Frontend dependencies
│
└── README.md           # This file
```

---

## 🔧 Configuration Reference

### Backend Environment Variables (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/quiz_system` |
| `JWT_SECRET` | Secret key for JWT tokens | (required) |

### Frontend Configuration (`frontend/vite.config.ts`)

| Setting | Description | Default |
|---------|-------------|---------|
| `server.port` | Frontend port | `3000` |
| `server.host` | Listen address | `0.0.0.0` (all interfaces) |
| `server.proxy` | API proxy target | `http://127.0.0.1:5000` |

---

## 📦 Dependencies

### Backend Dependencies
```json
{
  "bcryptjs": "^2.4.3",      // Password hashing
  "cors": "^2.8.5",          // Cross-origin requests
  "dotenv": "^16.3.1",       // Environment variables
  "express": "^4.18.2",      // Web framework
  "jsonwebtoken": "^9.0.2",  // JWT authentication
  "mongoose": "^8.0.3"       // MongoDB ODM
}
```

### Frontend Dependencies
```json
{
  "@monaco-editor/react": "^4.7.0",  // Code editor
  "axios": "^1.6.2",                 // HTTP client
  "lucide-react": "^0.563.0",        // Icons
  "react": "^18.2.0",                // UI framework
  "react-dom": "^18.2.0",            // React DOM
  "react-router-dom": "^6.21.1",     // Routing
  "tailwindcss": "^3.4.0",           // CSS framework
  "vite": "^5.0.8"                   // Build tool
}
```

---

## 🛠️ Troubleshooting

### MongoDB Connection Failed
```
Error: MongoNetworkError: connect ECONNREFUSED
```
**Solution:** Make sure MongoDB is running:
```bash
# Windows: Start MongoDB service
net start MongoDB

# Or run mongod manually
mongod
```

### Port Already in Use
```
Error: EADDRINUSE: address already in use
```
**Solution:** Kill the process using the port:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Can't Access from Other Devices
1. Check Windows Firewall settings
2. Verify both devices are on the same network
3. Make sure you're using the correct IP address
4. Try pinging your IP from the other device

### Login Issues
- Clear browser cache and cookies
- Check if backend is running
- Verify MongoDB has user data: `npm run seed`

---

## 📞 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/challenges` | Get all challenges |
| GET | `/api/challenges/:id` | Get challenge details |
| POST | `/api/challenges/:id/submit` | Submit solution |
| GET | `/api/admin/users` | Get all users (admin) |
| GET | `/api/admin/stats` | Get statistics (admin) |
| GET | `/api/admin/leaderboard` | Get leaderboard (admin) |

---

## 🎮 Features

- **Code Debugging Challenges** - Fix buggy code to pass test cases
- **Multiple Languages** - Support for Python, JavaScript, Java, C++
- **Real-time Scoring** - Points awarded for correct solutions
- **Hints System** - Progressive hints for each challenge
- **Admin Dashboard** - Manage users, view statistics, monitor progress
- **Leaderboard** - Track top performers
- **LAN Access** - Host on one machine, access from multiple devices

---

## 📄 License

This project is for educational purposes.

---

**Happy Coding! 🦸‍♂️**
