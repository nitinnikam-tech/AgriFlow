# AgriFlow

**Smart Procurement Queue Platform**  
*Smart India Hackathon 2026 - PS 26032 (DoCA)*

## The Problem
Farmers travel long distances to government procurement centres (Mandis) and wait for days in opaque, unmanaged queues with their harvest exposed to weather.

## The Solution
**THE QUEUE COMES TO THE FARMER.**
AgriFlow is an intelligent, real-time queue management system that completely eliminates physical waiting. Farmers book a slot, receive an AI-predicted arrival window, and are notified exactly when to travel. 

### Core Workflow
1. **Smart Slot Booking:** Farmer selects a preferred date.
2. **AI Allocation:** The system issues a Smart Token with dynamic peopleAhead and estimatedWaitTime.
3. **Arrival & Check-in:** Farmer arrives and securely checks in via QR Code or GPS Geofence.
4. **Live Radar:** Real-time WebSocket syncing keeps the farmer updated on queue movement.
5. **AI Officer Intelligence:** Centre admins receive proactive congestion warnings and AI recommendations to dynamically activate standby capacity.

## Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Socket.IO
- **AI Microservice:** Python, FastAPI, scikit-learn (RandomForestRegressor)
- **Database:** MongoDB (Dual-Mode: supports in-memory fallback for offline SIH pitching)
- **Security:** JWT Authentication, Role-Based Access Control (RBAC)

## Dual-Mode Architecture (MongoDB + Memory)
To guarantee the SIH demo never fails due to network issues, AgriFlow runs in **Dual-Mode**:
- **MongoDB Mode:** If MONGODB_URI is provided, full persistence is enabled.
- **Memory Mode:** If omitted, the system falls back to an in-memory datastore.
*The backend API /api/health endpoint explicitly reports the active persistence mode.*

## Running the Application

### 1. Prerequisites
- Node.js (v18+)
- Python (3.9+)
- MongoDB (optional, but recommended for production)

### 2. Environment Setup
Create a .env file in the server/ directory:
`env
PORT=5000
JWT_SECRET=your_super_secret_key_change_in_prod
JWT_EXPIRES_IN=24h
MONGODB_URI=mongodb://localhost:27017/agriflow
ML_SERVICE_URL=http://127.0.0.1:8000
CORS_ORIGIN=http://localhost:5173
`

### 3. Install Dependencies
`ash
# Backend
cd server
npm install

# Frontend
cd client
npm install

# ML Service
cd ml
pip install -r requirements.txt
`

### 4. Start the Application
For SIH judges / demonstration, we provide a unified startup script:
`ash
# Windows
.\start.ps1
`
This will automatically launch the Backend API (5000), Python ML Service (8000), and Frontend Vite Server (5173).

## Testing
`ash
cd server
npm run test           # Backend Unit Tests
node test/e2e.test.js  # WebSocket & E2E Flow
`

## Security & Roles
The application strictly enforces RBAC across HTTP endpoints and WebSocket events.
Available roles: FARMER, PROCUREMENT_OFFICER, CENTRE_ADMIN, DISTRICT_ADMIN.

## Disclaimers (SIH Technical Honesty)
- **Synthetic Data:** The machine learning model is trained on a generated dataset of 5000 records meant to simulate historical procurement times. Validation metrics (R² ˜ 0.97, MAE ˜ 4.2min) reflect this prototype data.
- **Simulated Integrations:** The DBT (Direct Benefit Transfer) Payment tracker and SMS notifications are visually simulated for the hackathon demonstration and do not connect to real banking/telecom APIs.
