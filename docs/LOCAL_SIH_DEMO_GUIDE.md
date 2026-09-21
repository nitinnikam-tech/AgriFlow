# AGRIFLOW LOCAL SIH DEMO

## STEP 1: Start the System
Double-click start-local.bat in the root folder.
This will open three command prompts running the Backend, ML Service, and Frontend.

*(Manual Fallback:)*
- **Backend:** cd server && npm start
- **ML:** cd ml && python -m uvicorn api.main:app --host 127.0.0.1 --port 8000
- **Frontend:** cd client && npm run dev

## STEP 2: Open Browsers
Open multiple tabs/windows to demonstrate real-time WebSocket sync:

- **Tab 1 (Farmer):** http://localhost:5173/
- **Tab 2 (Officer):** http://localhost:5173/officer
- **Tab 3 (Admin):** http://localhost:5173/admin
- **Tab 4 (Analytics):** http://localhost:5173/analytics
- **Tab 5 (Hero Pitch):** http://localhost:5173/hero-demo

## STEP 3: Demo Setup
Use the existing demo credentials. The OTP is automatically simulated for SIH demo purposes.
- Enter any valid phone number (e.g., 9999999999) and use the displayed OTP to login.
- Default Farmer ID: **FMR-1002**
- Default Target Token: **A-127**
- Default Centre ID: **PC-PUNE-01**

## STEP 4: Live Demonstration Flow
1. **Farmer Tab:** Book a slot, show live token (A-127) progress and ETA.
2. **Officer Tab:** Click 'Call Next Token' and 'Complete Token' to process farmers.
3. **Admin Tab:** Show live congestion.
4. **Wow Moment:** When the Officer completes a token, show the Farmer Tab updating in real-time instantly without page refresh via Socket.IO.
5. **AI Moment:** Trigger the 'Spike' in Admin Tab, watch the ML model predict congestion, automatically activate an extra counter, and see the Farmer ETA dynamically improve!

## LOCALHOST DEMO URLS
- 🌾 **Farmer:** http://localhost:5173/
- 🛡 **Procurement Officer:** http://localhost:5173/officer
- 🏢 **Centre Admin:** http://localhost:5173/admin
- 📊 **District Authority:** http://localhost:5173/analytics
- ❤️ **Hero Demo / SIH Pitch:** http://localhost:5173/hero-demo

## HEALTH CHECKS
- ⚙ **Backend API Health:** http://localhost:5000/health
- 🤖 **ML Service Docs:** http://localhost:8000/docs
