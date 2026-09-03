# SIH 2026 Judge Demo Guide

## What AgriFlow Solves
Farmers travel long distances to government procurement centres (Mandis) and wait for days in opaque, unmanaged queues with their harvest exposed to weather.

## 30-Second Pitch
**"The queue comes to the farmer."** 
Instead of waiting physically at a mandi, farmers book a smart slot. An AI predicts exactly when they will be served. They wait at home, tracking the live queue on their phone, and travel only when their Token is called. Centre admins get AI recommendations to open new counters if congestion spikes.

## Demo Credentials
All users can be simulated in Demo Mode.
- **Farmer Role:** Use the 'Login as Farmer' quick-fill button on /login
- **Officer Role:** Use the 'Login as Officer' quick-fill button on /login

## Full 5-Minute Demo Flow

### 1. The Setup (Officer Dashboard)
- Open the Officer Dashboard (/officer).
- Show the **Live Queue Radar**. It is currently moving smoothly.
- Point out the 4 active weighing counters.

### 2. The Hero Farmer (Farmer Portal)
- Open the Farmer Portal (/) in a new incognito window or split screen.
- Log in as Farmer Ramesh Patil.
- Show the **Smart Slot Booking**. Click "Book Recommended Slot".
- Ramesh receives **Token A-127**.
- Emphasize the live **Queue Position (18 ahead)** and **ETA (31 minutes)**.
- Ramesh clicks **Check-in via QR** (simulating gate arrival).

### 3. The Spike (Demo Controller)
- Use the **Demo Controller Bar** at the bottom of the screen.
- Click **Step 3: Trigger Congestion Spike**.
- *Watch both screens react instantly via WebSockets.*
- The Farmer's ETA jumps to 1hr 15m. The UI turns orange.
- The Officer's dashboard detects congestion. The AI Command Panel activates.

### 4. The AI Intelligence (Officer Dashboard)
- Show the judge the AI's logic in the **Explainability Card**. It detected a 400% arrival spike.
- The AI recommends: *Activate Standby Counter 5*.
- Click **[Approve Recommendation]**.

### 5. The Resolution (Real-time Sync)
- *Watch both screens again.*
- The Officer dashboard immediately shows 5 Active Counters.
- The Farmer's ETA instantly drops back down to 31 minutes.
- A notification pops up on the Farmer's screen: "More counters opened!"

### 6. Procurement & Completion
- Use the Demo Controller **Step 6: Call Token A-127**.
- The Farmer's UI updates to "Proceed to Counter 3".
- Use the Demo Controller **Step 7: Complete Procurement**.
- Show the Procurement Timeline reaching "DBT Payment Initiated".

### 7. Resetting the Demo
If you make a mistake or need to pitch to the next judge, simply click the **Reset Demo** button on the Demo Controller Bar. It instantly restores the initial queue state and Hero Token A-127.

## What is Real vs Simulated
**REAL:**
- WebSocket Queue Telemetry (ETA, Positions, Live Updates)
- Role-Based Access Control (JWT)
- Dual-Mode Persistence (MongoDB + Memory fallback)
- AI Model Inference (FastAPI / scikit-learn runs locally)

**SIMULATED:**
- DBT Payment API (Simulated for security)
- SMS/WhatsApp API (Simulated visually)
- ML Model Accuracy (Trained on synthetic prototype data)
