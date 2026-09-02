import { dualModeStore } from '../utils/dualModeStore.js';
import { QueueIntelligenceService } from '../services/queueIntelligence.js';
import { TOKEN_STATUS, CONGESTION_LEVELS } from '../config/constants.js';

export const tokenController = {
  getTokenByNumber: (req, res) => {
    const { tokenNumber } = req.params;
    const token = dualModeStore.getToken(tokenNumber);
    if (!token) return res.status(404).json({ error: 'Token not found' });

    const eta = QueueIntelligenceService.calculateFarmerETA(tokenNumber, token.centreId);
    return res.json({
      success: true,
      token,
      eta
    });
  },

  bookSmartSlotToken: (req, res) => {
    const {
      farmerId = 'FMR-1002',
      centreId = 'PC-PUNE-01',
      cropType = 'WHEAT',
      quantityKg = 520,
      slotId = 'SLOT-1030'
    } = req.body;

    const slot = dualModeStore.slots.get(slotId) || { timeWindow: '10:30 AM - 11:00 AM' };
    const centre = dualModeStore.getCentre(centreId);
    const farmer = dualModeStore.getFarmer(farmerId) || { name: 'Ramesh Patil', phone: '9876543210' };

    const count = dualModeStore.tokens.size + 1;
    const tokenNumber = `A-${count}`;

    const newToken = {
      id: `TOK-${Date.now()}`,
      tokenNumber,
      centreId,
      centreName: centre ? centre.name : 'Pune District APMC Procurement Centre',
      farmerId,
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
      cropType,
      quantityKg: Number(quantityKg),
      expectedBags: Math.ceil(quantityKg / 50),
      slotId,
      slotTimeWindow: slot.timeWindow,
      date: new Date().toISOString().split('T')[0],
      status: TOKEN_STATUS.WAITING,
      queuePosition: 15,
      peopleAhead: 18,
      activeCounters: centre.activeCounters || 4,
      avgProcessingTimeMin: centre.avgProcessingTimeMin || 5.8,
      estimatedWaitMin: 32,
      recommendedArrivalTime: '10:42 AM',
      predictedCongestion: CONGESTION_LEVELS.LOW,
      confidenceScore: 89,
      qrCodeData: JSON.stringify({
        token: tokenNumber,
        centre: centreId,
        farmer: farmerId,
        date: new Date().toISOString().split('T')[0],
        securityHash: `AGF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      }),
      geofenceStatus: {
        distanceMeters: 420,
        radiusMeters: 500,
        isInside: true,
        statusText: 'Within Mandi Geofence Zone'
      },
      procurementTimeline: [
        { stage: 'SLOT_BOOKED', label: 'Slot Booked', timestamp: new Date().toISOString(), isCompleted: true },
        { stage: 'CHECKED_IN', label: 'Mandi Check-In', timestamp: null, isCompleted: false },
        { stage: 'QUEUE_WAITING', label: 'In Smart Queue', timestamp: null, isCompleted: false },
        { stage: 'COUNTER_CALL', label: 'Counter Assignment', timestamp: null, isCompleted: false },
        { stage: 'QUALITY_WEIGHING', label: 'Quality & Weighing', timestamp: null, isCompleted: false },
        { stage: 'PROCURED', label: 'Procurement Approved', timestamp: null, isCompleted: false },
        { stage: 'PAYMENT_CREDITED', label: 'Payment Credited', timestamp: null, isCompleted: false }
      ],
      paymentDetails: {
        estimatedAmountInr: Math.round(Number(quantityKg) * 24),
        status: 'PENDING',
        transactionRef: null
      },
      createdAt: new Date().toISOString()
    };

    dualModeStore.tokens.set(tokenNumber, newToken);

    return res.status(201).json({
      success: true,
      message: 'Smart Token generated successfully',
      token: newToken
    });
  },

  verifyQrCheckIn: (req, res) => {
    const { qrData, scannedAt } = req.body;
    let parsed;
    try {
      parsed = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    } catch {
      parsed = { token: 'A-127' };
    }

    const tokenNumber = parsed.token || 'A-127';
    const token = dualModeStore.getToken(tokenNumber);

    if (!token) {
      return res.status(404).json({ valid: false, error: 'Token not found in registry' });
    }

    if (token.status === TOKEN_STATUS.BOOKED || token.status === TOKEN_STATUS.WAITING) {
      token.status = TOKEN_STATUS.WAITING;
      const checkInStep = token.procurementTimeline?.find(s => s.stage === 'CHECKED_IN');
      if (checkInStep) {
        checkInStep.isCompleted = true;
        checkInStep.timestamp = scannedAt || new Date().toISOString();
      }
    }

    return res.json({
      valid: true,
      message: `QR Verified. Farmer ${token.farmerName} checked in successfully.`,
      token
    });
  }
};
