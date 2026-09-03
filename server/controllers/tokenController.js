import { repository as dualModeStore } from '../repositories/index.js';
import { QueueIntelligenceService } from '../services/queueIntelligence.js';
import { TOKEN_STATUS, CONGESTION_LEVELS } from '../config/constants.js';

export const tokenController = {
  getTokenByNumber: async (req, res) => {
    const { tokenNumber } = req.params;
    const token = await dualModeStore.getToken(tokenNumber);
    if (!token) return res.status(404).json({ error: 'Token not found' });

    const eta = await QueueIntelligenceService.calculateFarmerETA(tokenNumber, token.centreId);
    return res.json({
      success: true,
      token,
      eta
    });
  },

  bookSmartSlotToken: async (req, res) => {
    const {
      farmerId = 'FMR-1002',
      centreId = 'PC-PUNE-01',
      cropType = 'WHEAT',
      quantityKg = 520,
      slotId = 'SLOT-1030'
    } = req.body;

    const slot = await dualModeStore.getSlot(slotId) || { timeWindow: '10:30 AM - 11:00 AM' };
    const centre = await dualModeStore.getCentre(centreId);
    const farmer = await dualModeStore.getFarmer(farmerId) || { name: 'Ramesh Patil', phone: '9876543210' };

    // Extract highest number from existing A-### tokens to prevent collisions
    const existingIds = Array.from((await dualModeStore.getAllTokens()).map(t => t.tokenNumber))
        .filter(k => k.startsWith('A-'))
        .map(k => parseInt(k.replace('A-', ''), 10))
        .filter(n => !isNaN(n));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    let count = Math.max((await dualModeStore.getTokensCount()) + 1, maxId + 1);
    let tokenNumber = `A-${count}`;
    while ((await dualModeStore.getToken(tokenNumber)) != null) {
      count++;
      tokenNumber = `A-${count}`;
    }

    const existingPositions = Array.from((await dualModeStore.getAllTokens()))
        .filter(t => t.centreId === centreId)
        .map(t => t.queuePosition || 0);
    const nextQueuePosition = (existingPositions.length > 0 ? Math.max(...existingPositions) : 0) + 1;

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
      queuePosition: nextQueuePosition,
      peopleAhead: 0, // Will be calculated by QueueIntelligenceService
      activeCounters: centre ? (centre.activeCounters || 4) : 4,
      avgProcessingTimeMin: centre ? (centre.avgProcessingTimeMin || 5.8) : 5.8,
      estimatedWaitMin: 0, // Will be calculated
      recommendedArrivalTime: 'N/A',
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

    await dualModeStore.saveToken(tokenNumber, newToken);

    // Calculate dynamic ETA and peopleAhead
    await QueueIntelligenceService.calculateFarmerETA(tokenNumber, centreId);

    return res.status(201).json({
      success: true,
      message: 'Smart Token generated successfully',
      token: await dualModeStore.getToken(tokenNumber)
    });
  },

  verifyQrCheckIn: async (req, res) => {
    const { qrData, scannedAt } = req.body;
    let parsed;
    try {
      parsed = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    } catch {
      parsed = { token: 'A-127' };
    }

    const tokenNumber = parsed.token || 'A-127';
    const token = await dualModeStore.getToken(tokenNumber);

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
