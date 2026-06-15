# Quick Start Guide - Pedal For The Planet

## One-Time Setup

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Setup MongoDB
Choose one option:

**Option A: Local MongoDB (Easiest for development)**
1. Download from: https://www.mongodb.com/try/download/community
2. Install and start the MongoDB service
3. No additional configuration needed (uses localhost:27017)

**Option B: MongoDB Atlas (Cloud)**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string (copy from Atlas dashboard)
4. See step 3 below

### 3. Configure Backend
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/pedalfortheplanet
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secure_random_string_here
NODE_ENV=development
```

If using MongoDB Atlas, replace MONGODB_URI with your connection string.

## Running the App

### Start in separate terminals:

**Terminal 1 - Backend Server:**
```bash
npm run server:dev
```
✓ Backend will run on http://localhost:5000

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```
✓ Frontend will run on http://localhost:5173

### First Time Use
1. Navigate to http://localhost:5173
2. The app should now work with the new backend
3. All data is stored in MongoDB

## Common Tasks

### View MongoDB Data (Local)
```bash
mongosh
use pedalfortheplanet
db.registrations.find()
```

### Reset Database
```bash
# Using mongosh
mongosh
use pedalfortheplanet
db.dropDatabase()
```

### Stop Services
- Backend: Press Ctrl+C in Terminal 1
- Frontend: Press Ctrl+C in Terminal 2

## Troubleshooting

**"Cannot connect to MongoDB"**
- Ensure MongoDB is running
- Check MONGODB_URI in server/.env
- Try `mongosh` to verify local connection

**"Port 5000 already in use"**
- Change PORT in server/.env to 5001
- Update proxy in vite.config.js

**"Cannot POST /api/..."**
- Ensure backend is running
- Check http://localhost:5000/health returns 200
- Check browser console for CORS errors

**Auth errors**
- Clear browser localStorage
- Try logging in again
- Check JWT_SECRET is consistent

## Next Steps

1. Review [Backend Documentation](./server/README.md)
2. Review [Main README](./README.md)
3. Configure M-Pesa payment integration in `server/routes/payments.js`
4. Deploy to production

## Useful Commands

```bash
# Development
npm run dev                 # Frontend only
npm run server:dev         # Backend with auto-reload
npm run server             # Backend production

# Building
npm run build              # Build for production

# Code quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run typecheck          # Check TypeScript types

# Full stack
# (run in 2 terminals)
npm run server:dev &
npm run dev
```

## File Locations

- **Frontend config:** `vite.config.js`, `tailwind.config.js`
- **Backend config:** `server/.env`, `server/index.js`
- **Database models:** `server/models/`
- **API routes:** `server/routes/`
- **Frontend components:** `src/components/`
- **Frontend pages:** `src/pages/`

For more details, see the README files in the root and server directories.
