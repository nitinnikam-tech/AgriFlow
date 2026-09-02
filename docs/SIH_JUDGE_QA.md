# AgriFlow SIH 2026 Judge Q&A Preparation Guide

### Q1: What problem are you solving?
**A:** Farmers at mandis face unpredictable waiting times (often 4-8 hours), severe yard congestion, and opaque quality/payment tracking. AgriFlow turns static procurement into a real-time, predictive cyber-physical system.

### Q2: Why isn't this just another slot-booking app?
**A:** Slot-booking apps merely reserve a static hour. If counters slow down or trucks arrive late, static slots collapse. AgriFlow continuously calculates live queue velocity, active counter capacity, crop inspection complexity, and AI ETA, dynamically balancing workload and recommending exact arrival times.

### Q3: How does real-time synchronization work?
**A:** Using Socket.IO WebSockets. When an officer calls or completes a token at any counter, the server atomically updates queue positions and broadcasts the recalculated ETA to the farmer's mobile screen in under 15ms.

### Q4: How is waiting time calculated?
**A:** $\text{Raw Wait} = \frac{\text{People Ahead} \times \text{Avg Processing Time}}{\text{Active Counters}} \times \text{Crop Multiplier} \times \text{Rush Penalty}$.

### Q5: What is prototype vs real in this implementation?
**A:**
- **Real:** React UI, Express backend, Socket.IO WebSockets, Queue calculations, Scikit-Learn ML engine, XAI feature weights, QR verification.
- **Simulated for Prototype:** External SMS/WhatsApp API gateways, bank PFMS fund transfers, GPS coordinates.
