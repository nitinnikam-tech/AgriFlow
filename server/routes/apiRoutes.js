import express from 'express';
import { authController } from '../controllers/authController.js';
import { centreController } from '../controllers/centreController.js';
import { slotController } from '../controllers/slotController.js';
import { tokenController } from '../controllers/tokenController.js';
import { queueController } from '../controllers/queueController.js';
import { officialController } from '../controllers/officialController.js';
import { qualityController } from '../controllers/qualityController.js';
import { paymentController } from '../controllers/paymentController.js';
import { analyticsController } from '../controllers/analyticsController.js';
import { demoController } from '../controllers/demoController.js';
import { AIInferenceService } from '../services/aiInferenceService.js';
import { NotificationService } from '../services/notificationService.js';
import { dualModeStore } from '../utils/dualModeStore.js';

const router = express.Router();

// 1. Auth & Profiles
router.post('/auth/otp/send', authController.sendOtp);
router.post('/auth/otp/verify', authController.verifyOtp);
router.post('/auth/official/login', authController.officialLogin);
router.get('/auth/profile', authController.getProfile);

// 2. Centres & Mandi Facilities
router.get('/centres', centreController.getAllCentres);
router.get('/centres/:id', centreController.getCentreById);
router.get('/centres/:id/digital-twin', centreController.getDigitalTwinTelemetry);
router.get('/centres/:id/crowd-forecast', centreController.getCrowdForecast);

// 3. Smart Slots
router.get('/slots', slotController.getSlots);
router.get('/slots/optimization-proposal', slotController.getOptimizationProposal);
router.post('/slots/apply-optimization', slotController.applyOptimization);

// 4. Smart Tokens & QR
router.post('/tokens/book', tokenController.bookSmartSlotToken);
router.get('/tokens/:tokenNumber', tokenController.getTokenByNumber);
router.post('/tokens/verify-qr', tokenController.verifyQrCheckIn);

// 5. Live Queue Intelligence & ETA
router.get('/queue/live', queueController.getLiveQueue);
router.get('/queue/eta/:tokenNumber', queueController.getFarmerETA);

// 6. Official & Counter Management
router.get('/official/counters', officialController.getCounters);
router.get('/official/workload-balancing', officialController.getCounterWorkloadBalancing);

// 7. Quality Inspection & Weighing
router.post('/quality/inspect', qualityController.submitInspection);

// 8. Payment Tracking (DBT/PFMS Simulation)
router.get('/payments/:tokenNumber', paymentController.getPaymentStatus);
router.post('/payments/simulate-credit', paymentController.simulatePaymentCredit);

// 9. District / Mandi Analytics
router.get('/analytics/dashboard', analyticsController.getCentreDashboardStats);

// 10. AI Inference Endpoint
router.post('/ai/predict-eta', async (req, res) => {
  const result = await AIInferenceService.predictWaitingTime(req.body);
  return res.json({ success: true, ...result });
});

// 11. Notifications Hub
router.get('/notifications/farmer/:farmerId', (req, res) => {
  const notifs = dualModeStore.getFarmerNotifications(req.params.farmerId || 'FMR-1002');
  return res.json({ success: true, notifications: notifs });
});

router.post('/notifications/send', (req, res) => {
  const { farmerId = 'FMR-1002', title, body, type, channel } = req.body;
  const notifs = NotificationService.sendFarmerNotification(farmerId, { title, body, type, channel });
  return res.json({ success: true, notifications: notifs });
});

// 12. SIH Demo Controller Routes
router.get('/demo/state', demoController.getDemoState);
router.post('/demo/advance', demoController.advanceStep);
router.post('/demo/reset', demoController.resetDemo);

export default router;
