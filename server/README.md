# Pedal For The Planet - Backend Setup Guide

This is a Node.js/Express backend using MongoDB to replace Base44.

## Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas cloud database)
- npm or yarn

## Installation

1. Install backend dependencies:
```bash
npm install
```

2. Create a `.env` file in the `server/` directory:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/pedalfortheplanet
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
MPESA_API_URL=https://sandbox.pesapal.com/api/
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
```

## Running the Backend

### Development
```bash
npm run server:dev
```
This uses nodemon for auto-restart on file changes.

### Production
```bash
npm run server
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Users
- `POST /users/register` - Register a new user
- `POST /users/login` - Login user
- `GET /users/me` - Get current user (requires auth token)
- `GET /users/:id` - Get user by ID

### Registrations
- `GET /registrations` - Get all registrations
- `GET /registrations/:id` - Get registration by ID
- `POST /registrations` - Create new registration
- `PUT /registrations/:id` - Update registration
- `DELETE /registrations/:id` - Delete registration

### SOS Alerts
- `GET /sos-alerts` - Get all SOS alerts
- `GET /sos-alerts/active` - Get active SOS alerts
- `GET /sos-alerts/:id` - Get SOS alert by ID
- `POST /sos-alerts` - Create new SOS alert
- `PUT /sos-alerts/:id` - Update SOS alert status

### Payments
- `POST /payments/mpesa` - Initialize M-Pesa payment (mock)
- `POST /payments/verify` - Verify payment callback

## Database Schema

### User
- `email` (String, unique, required)
- `name` (String, required)
- `phone` (String)
- `password` (String, hashed)
- `isRegistered` (Boolean)
- `role` (String) - 'admin' or 'user'
- `createdAt` (Date)
- `updatedAt` (Date)

### Registration
- `name` (String, required)
- `email` (String, required)
- `phone` (String, required)
- `route_km` (String, required)
- `tier` (String, required) - 'Individual' or 'Family of 4'
- `tshirt_size` (String) - default 'M'
- `payment_status` (String) - 'pending', 'completed', 'failed'
- `lat` (Number)
- `lng` (Number)
- `paymentReference` (String)
- `createdAt` (Date)
- `updatedAt` (Date)

### SosAlert
- `rider_name` (String, required)
- `rider_phone` (String)
- `route_km` (String)
- `route_name` (String)
- `lat` (Number)
- `lng` (Number)
- `maps_url` (String)
- `status` (String) - 'active', 'resolved', 'acknowledged'
- `createdAt` (Date)
- `updatedAt` (Date)

## Frontend Setup

1. Install frontend dependencies (in root):
```bash
npm install
```

2. Run frontend in development:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` and proxy API calls to `http://localhost:5000`.

## Running Both Together

In separate terminals:

Terminal 1 (Backend):
```bash
cd server
npm run server:dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## MongoDB Setup

### Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Update `MONGODB_URI` in `.env` to `mongodb://localhost:27017/pedalfortheplanet`

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` with your connection string

## Authentication

The app uses JWT tokens stored in localStorage. When a user logs in, they receive a token that's automatically included in API requests via the Authorization header.

## M-Pesa Integration (TODO)

The payment endpoints are currently mock implementations. To integrate with real M-Pesa:

1. Get API credentials from Pesapal
2. Update the `/payments/mpesa` endpoint in `server/routes/payments.js`
3. Implement proper payment verification in `/payments/verify`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify credentials if using Atlas

### CORS Issues
- Update `FRONTEND_URL` in `.env` to match your frontend URL
- Ensure frontend proxy is configured in `vite.config.js`

### Token Issues
- Clear localStorage if experiencing auth issues
- Verify JWT_SECRET matches between sessions

## Development Notes

- All timestamps are in UTC
- Passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- API uses standard RESTful conventions
