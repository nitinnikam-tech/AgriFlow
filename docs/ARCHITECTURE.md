# AgriFlow System Architecture
## SIH 2026 Problem Statement PS 26032 (DoCA)

AgriFlow converts traditional static slot booking into a **Cyber-Physical Real-Time Queue Intelligence Platform**.

---

## 1. High-Level Architecture Overview

```mermaid
graph TD
    subgraph Client_Layer [Frontend Layer - React + Vite]
        FARMER[Farmer Mobile-First Portal]
        OFFICER[Official Command Desk]
        ADMIN[Centre Admin Digital Twin]
        DISTRICT[District Analytics Hub]
        DEMO[SIH Hero Pitch Controller]
    end

    subgraph RealTime_Gateway [Real-Time & API Gateway - Node.js Express]
        HTTP_ROUTER[REST API Engine]
        SOCKET_HUB[Socket.IO Real-Time Engine]
        AUTH_GUARD[JWT & RBAC Middleware]
        QUEUE_INTEL[Queue Intelligence Engine]
        SLOT_OPT[Dynamic Slot Optimizer]
        NOTIF_SVC[Multi-Channel Notification Hub]
    end

    subgraph AI_Layer [Intelligence Layer - Python / Scikit-Learn]
        FASTAPI[FastAPI ML Microservice]
        RF_MODEL[Random Forest Wait-Time Regressor]
        XAI[Explainable Feature Importance Engine]
    end

    subgraph Data_Layer [Dual-Mode Persistence Layer]
        MEMORY_STORE[High-Speed In-Memory Data Store]
        MONGO_DB[(MongoDB Enterprise / Atlas)]
    end

    Client_Layer <-->|WebSocket bi-directional sync| SOCKET_HUB
    Client_Layer <-->|RESTful JSON API| HTTP_ROUTER
    HTTP_ROUTER --> QUEUE_INTEL
    HTTP_ROUTER --> SLOT_OPT
    HTTP_ROUTER --> NOTIF_SVC
    QUEUE_INTEL <-->|Inference Pipeline| FASTAPI
    FASTAPI --> RF_MODEL
    FASTAPI --> XAI
    HTTP_ROUTER <--> Data_Layer
```

---

## 2. Real-Time WebSocket Synchronization Protocol

When an officer completes or calls a token:
1. `token:complete` event is emitted by Officer Desk.
2. Server executes atomic queue advancement:
   - Sets Token status to `COMPLETED`.
   - Decrements `peopleAhead` for all subsequent waiting tokens.
   - Recalculates dynamic ETA ($\text{ETA} = \frac{\text{People Ahead} \times \text{Average Time}}{N_{\text{active}}}$).
3. Server broadcasts `queue:update` and `eta:update` to specific rooms (`centre:PC-PUNE-01` and `farmer:A-127`).
4. Connected Farmer client updates live radar, countdown, and audio chime with $< 15\text{ms}$ latency without browser reload.

---

## 3. Privacy by Design & Security
- Zero biometric/facial data stored.
- Anonymized analytics tokens (`A-127`, `FMR-1002`).
- Signed QR codes with sha256 checksum validation.
- Role-Based Access Control (RBAC) enforced via JWT authentication on API endpoints and WebSocket handshakes. Passwords are salted and hashed using bcrypt.
