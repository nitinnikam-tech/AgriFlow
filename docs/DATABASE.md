# AgriFlow Database Architecture & Scaling Roadmap

## 1. Dual-Mode Architecture
AgriFlow features a **Dual-Mode Data Store**:
- **In-Memory Store:** Starts instantly with zero external dependencies and 100+ pre-seeded realistic farmers, tokens, and centres for hackathon demonstrations.
- **MongoDB Mode:** Automatically connects to MongoDB when `MONGODB_URI` is configured in `.env`.

## 2. Schema Models
- `Farmer`: ID, Name, Phone, AadhaarHash, Village, District, State, BankDetails.
- `Centre`: ID, Name, Code, Location, TotalCounters, ActiveCounters, DailyCapacity.
- `Slot`: ID, CentreID, TimeWindow, MaxCapacity, BookedCount, CongestionLevel.
- `Token`: ID, TokenNumber, CentreID, FarmerID, CropType, QuantityKg, QueuePosition, Status.
- `Counter`: ID, CentreID, CounterNumber, OfficerName, Status, CurrentToken, AvgTime.
- `QualityInspection`: ID, TokenID, NetWeightKg, MoisturePercent, Grade, Status.
- `Payment`: ID, TokenID, AmountINR, Status, TransactionRef, CreditedAt.
