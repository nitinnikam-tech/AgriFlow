import express from 'express';
import { getDatabaseStatus } from '../config/database.js';
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
import { repository as dualModeStore } from '../repositories/index.js';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// 1. Auth & Profiles
router.post('/auth/otp/send', authController.sendOtp);
router.post('/auth/otp/verify', authController.verifyOtp);
router.post('/auth/official/login', authController.officialLogin);
router.get('/auth/profile', authMiddleware, authController.getProfile);

// 2. Centres & Mandi Facilities (Public read, Admin manage)
router.get('/centres', centreController.getAllCentres);
router.get('/centres/:id', centreController.getCentreById);
router.get('/centres/:id/digital-twin', centreController.getDigitalTwinTelemetry);
router.get('/centres/:id/crowd-forecast', centreController.getCrowdForecast);

// 3. Smart Slots (Farmer books slots)
router.get('/slots', slotController.getSlots);
router.get('/slots/optimization-proposal', authMiddleware, authorizeRoles(USER_ROLES.OFFICER, USER_ROLES.CENTRE_ADMIN), slotController.getOptimizationProposal);
router.post('/slots/apply-optimization', authMiddleware, authorizeRoles(USER_ROLES.OFFICER, USER_ROLES.CENTRE_ADMIN), slotController.applyOptimization);

// 4. Smart Tokens & QR
router.post('/tokens/book', authMiddleware, authorizeRoles(USER_ROLES.FARMER), tokenController.bookSmartSlotToken);
router.get('/tokens/:tokenNumber', authMiddleware, tokenController.getTokenByNumber);
router.post('/tokens/verify-qr', authMiddleware, authorizeRoles(USER_ROLES.OFFICER, USER_ROLES.CENTRE_ADMIN), tokenController.verifyQrCheckIn);

// 5. Live Queue Intelligence & ETA
router.get('/queue/live', queueController.getLiveQueue);
router.get('/queue/eta/:tokenNumber', queueController.getFarmerETA);

// 6. Official & Counter Management
router.get('/official/counters', authMiddleware, authorizeRoles(USER_ROLES.OFFICER, USER_ROLES.CENTRE_ADMIN), officialController.getCounters);
router.get('/official/workload-balancing', authMiddleware, authorizeRoles(USER_ROLES.OFFICER, USER_ROLES.CENTRE_ADMIN), officialController.getCounterWorkloadBalancing);

// 7. Quality Inspection & Weighing
router.post('/quality/inspect', authMiddleware, authorizeRoles(USER_ROLES.OFFICER, USER_ROLES.CENTRE_ADMIN), qualityController.submitInspection);

// 8. Payment Tracking (DBT/PFMS Simulation)
router.get('/payments/:tokenNumber', authMiddleware, paymentController.getPaymentStatus);
router.post('/payments/simulate-credit', authMiddleware, authorizeRoles(USER_ROLES.OFFICER, USER_ROLES.CENTRE_ADMIN), paymentController.simulatePaymentCredit);

// 9. District / Mandi Analytics
router.get('/analytics/dashboard', authMiddleware, authorizeRoles(USER_ROLES.DISTRICT_ADMIN, USER_ROLES.CENTRE_ADMIN), analyticsController.getCentreDashboardStats);

router.get('/health', async (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: { ml: 'connected', queue: 'active' },
    database: getDatabaseStatus()
  });
});

// 10. AI Inference Endpoint
router.post('/ai/predict-eta', async (req, res) => {
  const result = await AIInferenceService.predictWaitingTime(req.body);
  return res.json({ success: true, ...result });
});

// 11. Notifications Hub
router.get('/notifications/farmer/:farmerId', authMiddleware, authorizeRoles(USER_ROLES.FARMER), async (req, res) => {
  // Check if they are requesting their own notifications
  if (req.user.sub !== req.params.farmerId && req.user.role === USER_ROLES.FARMER) {
    return res.status(403).json({ error: 'Cannot view other farmers notifications' });
  }
  const notifs = await dualModeStore.getFarmerNotifications(req.params.farmerId || 'FMR-1002');
  return res.json({ success: true, notifications: notifs });
});

router.post('/notifications/send', authMiddleware, authorizeRoles(USER_ROLES.OFFICER, USER_ROLES.CENTRE_ADMIN, USER_ROLES.SYSTEM_ADMIN), async (req, res) => {
  const { farmerId = 'FMR-1002', title, body, type, channel } = req.body;
  const notifs = NotificationService.sendFarmerNotification(farmerId, { title, body, type, channel });
  return res.json({ success: true, notifications: notifs });
});

// 12. SIH Demo Controller Routes (Keep demo routes public for judges/testing)
router.get('/demo/state', demoController.getDemoState);
router.post('/demo/advance', demoController.advanceStep);
router.post('/demo/reset', demoController.resetDemo);

export default router;
