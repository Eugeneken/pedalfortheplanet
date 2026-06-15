**Pedal For The Planet** 

**About**

A comprehensive event management and ride tracking system for managing bicycle events with real-time GPS tracking, user registration, and emergency alerts.

**Architecture**

- **Frontend:** React + Vite with TailwindCSS
- **Backend:** Node.js/Express 
- **Database:** MongoDB
- **Real-time:** Socket.io ready (optional)

**Prerequisites:** 

1. Node.js (v16+)
2. MongoDB (local or Atlas)
3. npm or yarn

**Quick Start**

1. Clone the repository
2. Navigate to the project directory
3. Install frontend dependencies: `npm install`
4. Install backend dependencies: `cd server && npm install && cd ..`

### Setup Environment

Create `.env` files for backend configuration:

```bash
# In server/ directory, create .env
MONGODB_URI=mongodb://localhost:27017/pedalfortheplanet
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
```

### Run the Application

**Terminal 1 - Backend Server:**
```bash
npm run server:dev
```
Backend runs on http://localhost:5000

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```
Frontend runs on http://localhost:5173

### API Proxy

The frontend is configured to proxy API requests to the backend. Requests to `/api/*` are forwarded to `http://localhost:5000/*`

**Project Structure**

```
├── server/                 # Backend (Node.js/Express)
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── config/            # Configuration
│   └── index.js           # Server entry point
├── src/
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities and context
│   ├── api/               # API client
│   └── App.jsx            # Main app component
└── public/                # Static files
```

**Key Features**

- User registration and authentication
- Real-time GPS ride tracking
- Emergency SOS alerts with location sharing
- Admin dashboard for event management
- M-Pesa payment integration (ready for setup)
- Route management and coordinates editing

**Database Setup**

### Option 1: Local MongoDB
1. Install from https://www.mongodb.com/try/download/community
2. Start the MongoDB service
3. Backend will connect to `mongodb://localhost:27017/pedalfortheplanet`

### Option 2: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Update `MONGODB_URI` in `server/.env`

**Building for Production**

```bash
npm run build
```

**Docs & Support**

See `server/README.md` for detailed backend documentation.

