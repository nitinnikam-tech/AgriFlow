# AgriFlow REST & WebSocket API Specification

## Base URL: `http://localhost:5000/api`

### 1. Authentication
- `POST /auth/otp/send`: Generates simulated SMS OTP.
- `POST /auth/otp/verify`: Validates OTP and returns farmer session token.
- `POST /auth/official/login`: Role login for Officer / Admin / District Authority.

### 2. Centres & Telemetry
- `GET /centres`: List all active procurement centres.
- `GET /centres/:id`: Get centre profile and live queue statistics.
- `GET /centres/:id/digital-twin`: Retrieve 7-zone mandi yard occupancy telemetry.
- `GET /centres/:id/crowd-forecast`: Hourly crowd predictions.

### 3. Smart Slots & Tokens
- `GET /slots`: Get available slots with congestion tags (`LOW`, `MEDIUM`, `HIGH`).
- `GET /slots/optimization-proposal`: Get AI rebalance proposal.
- `POST /slots/apply-optimization`: Apply dynamic slot redistribution.
- `POST /tokens/book`: Generate smart token with dynamic QR.
- `GET /tokens/:tokenNumber`: Fetch token details and live ETA.
- `POST /tokens/verify-qr`: Validate QR check-in at mandi gate.

### 4. Queue & Official Actions
- `GET /queue/live`: Live queue count, active counters, velocity.
- `GET /queue/eta/:tokenNumber`: Explainable AI waiting time breakdown.
- `POST /quality/inspect`: Record net weight, moisture %, quality grade.
- `POST /payments/simulate-credit`: Simulate DBT PFMS bank payout.

### 5. WebSocket Events (Socket.IO)
- `join:centre` / `join:farmer`: Join real-time broadcast rooms.
- `token:call_next`: Officer calls next waiting token.
- `token:complete`: Officer completes current token.
- `counter:add`: Enables reserve Counter 5.
- `demo:trigger_spike`: Simulates crowd arrival surge.
