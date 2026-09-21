import { repository as dualModeStore } from '../repositories/index.js';
import { QueueIntelligenceService } from '../services/queueIntelligence.js';
import { SlotOptimizerService } from '../services/slotOptimizer.js';
import { NotificationService } from '../services/notificationService.js';
import { TOKEN_STATUS, CONGESTION_LEVELS, USER_ROLES } from '../config/constants.js';
import jwt from 'jsonwebtoken';

export function setupSocketHandlers(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      // In a strict prod environment, we would reject. 
      // For demo preservation, allow connection but mark as unauthenticated.
      socket.user = null;
      return next();
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
      socket.user = decoded;
      next();
    } catch (err) {
      // Still allow connection but without user
      socket.user = null;
      next();
    }
  });

  io.on('connection', (socket) => {
    const checkRole = (socket, allowedRoles, eventName) => {
      if (!socket.user || !allowedRoles.includes(socket.user.role)) {
        console.warn(`[Security] Unauthorized socket action '${eventName}' from user ${socket.user?.sub || 'anonymous'} (Role: ${socket.user?.role || 'none'})`);
        socket.emit('toast:error', { message: `Unauthorized action: ${eventName}` });
        return false;
      }
      return true;
    };

    socket.on('join:centre', async (centreId = 'PC-PUNE-01') => {
      socket.join(`centre:${centreId}`);
      const queueState = await QueueIntelligenceService.getCentreQueueState(centreId);
      socket.emit('queue:update', queueState);
    });

    socket.on('join:farmer', async ({ tokenNumber, centreId = 'PC-PUNE-01' }) => {
      socket.join(`farmer:${tokenNumber}`);
      const eta = await QueueIntelligenceService.calculateFarmerETA(tokenNumber, centreId);
      socket.emit('eta:update', eta);
    });

    socket.on('token:call_next', async ({ counterId, centreId = 'PC-PUNE-01' }) => {
      if (!checkRole(socket, [USER_ROLES.OFFICER, USER_ROLES.CENTRE_ADMIN, USER_ROLES.SYSTEM_ADMIN], 'token:call_next')) return;

      const counter = await dualModeStore.getCounter(counterId);
      if (!counter) return;

      const canonicalQueue = await QueueIntelligenceService.getCanonicalQueue(centreId);
        const nextToken = canonicalQueue.find(t => t.status === TOKEN_STATUS.WAITING);

        if (nextToken) {
        nextToken.status = TOKEN_STATUS.PROCESSING; console.log('WAITING LENGTH NOW:', allWaiting.length - 1);
        nextToken.counterId = counterId;
        counter.status = 'PROCESSING';
        counter.currentToken = nextToken.tokenNumber;
        counter.currentCrop = nextToken.cropType;

        broadcastCentreAndFarmerUpdates(io, centreId, nextToken.tokenNumber, `Token ${nextToken.tokenNumber} called to Counter ${counter.counterNumber}`);
      }
    });

    socket.on('token:complete', async ({ counterId, tokenNumber, centreId = 'PC-PUNE-01' }) => {
      if (!checkRole(socket, [USER_ROLES.OFFICER, USER_ROLES.CENTRE_ADMIN, USER_ROLES.SYSTEM_ADMIN], 'token:complete')) return;

      const counter = await dualModeStore.getCounter(counterId);
      const token = await dualModeStore.getToken(tokenNumber);

      if (token) {
        token.status = TOKEN_STATUS.COMPLETED;
        token.completedAt = new Date().toISOString();
        if (token.procurementTimeline) {
          token.procurementTimeline.forEach(step => {
            if (['COUNTER_CALL', 'QUALITY_WEIGHING', 'PROCURED'].includes(step.stage)) {
              step.isCompleted = true;
              step.timestamp = new Date().toISOString();
            }
          });
        }
      }

      if (counter) {
        counter.tokensProcessedToday = (counter.tokensProcessedToday || 0) + 1;
        counter.currentToken = null;
        counter.status = 'IDLE';
      }

      const heroToken = await dualModeStore.getToken('A-127');
      if (heroToken && heroToken.status === TOKEN_STATUS.WAITING) {
        if (heroToken.peopleAhead > 1) {
          heroToken.peopleAhead -= 1;
          heroToken.estimatedWaitMin = Math.max(1, Math.round((heroToken.peopleAhead * 5.8) / (await QueueIntelligenceService.getCentreQueueState(centreId).activeCountersCount || 4)));
        }
      }

      broadcastCentreAndFarmerUpdates(io, centreId, tokenNumber, `Token ${tokenNumber} processing completed.`);
    });

    socket.on('counter:toggle', async ({ counterId, centreId = 'PC-PUNE-01' }) => {
      if (!checkRole(socket, [USER_ROLES.OFFICER, USER_ROLES.CENTRE_ADMIN, USER_ROLES.SYSTEM_ADMIN], 'counter:toggle')) return;

      const counter = await dualModeStore.getCounter(counterId);
      if (counter) {
        if (counter.status === 'PROCESSING') {
          counter.status = 'PAUSED';
          broadcastCentreAndFarmerUpdates(io, centreId, null, `Counter ${counter.counterNumber} paused`);
        } else if (counter.status === 'PAUSED') {
          counter.status = 'PROCESSING';
          broadcastCentreAndFarmerUpdates(io, centreId, null, `Counter ${counter.counterNumber} resumed processing`);
        } else {
          socket.emit('toast:error', { message: `Cannot pause/resume counter in ${counter.status} state` });
        }
      }
    });

    socket.on('counter:add', async ({ centreId = 'PC-PUNE-01' }) => {
      if (!checkRole(socket, [USER_ROLES.OFFICER, USER_ROLES.CENTRE_ADMIN, USER_ROLES.SYSTEM_ADMIN], 'counter:add')) return;

      const counters = await dualModeStore.getCountersByCentre(centreId);
      const idleOrInactive = counters.find(c => c.status === 'IDLE' || c.status === 'INACTIVE');
      if (idleOrInactive) {
        idleOrInactive.status = 'PROCESSING';
        idleOrInactive.currentToken = 'A-113';
        const tok113 = await dualModeStore.getToken('A-113');
        if (tok113) tok113.status = TOKEN_STATUS.PROCESSING;

        const heroToken = await dualModeStore.getToken('A-127');
        if (heroToken) {
          heroToken.activeCounters = 5;
          heroToken.estimatedWaitMin = 19;
          heroToken.recommendedArrivalTime = '10:38 AM';
          heroToken.predictedCongestion = CONGESTION_LEVELS.MEDIUM;
          NotificationService.broadcastQueueImprovement(centreId, '10:38 AM');
        }
        if (heroToken && heroToken.status === TOKEN_STATUS.WAITING) {
          if (heroToken.peopleAhead > 1) {
            heroToken.peopleAhead -= 1;
            const qState = await QueueIntelligenceService.getCentreQueueState(centreId);
            heroToken.estimatedWaitMin = Math.max(1, Math.round((heroToken.peopleAhead * 5.8) / (qState.activeCountersCount || 4)));
          }
        }

        await broadcastCentreAndFarmerUpdates(io, centreId, 'A-127', 'Counter 5 activated! Queue wait time reduced.');
      }
    });

    socket.on('demo:trigger_spike', async ({ centreId = 'PC-PUNE-01' }) => {
      if (!checkRole(socket, [USER_ROLES.CENTRE_ADMIN, USER_ROLES.DISTRICT_ADMIN, USER_ROLES.SYSTEM_ADMIN], 'demo:trigger_spike')) return;

      await dualModeStore.setIsSimulatingCongestion(true);
      const heroToken = await dualModeStore.getToken('A-127');
      if (heroToken) {
        heroToken.predictedCongestion = CONGESTION_LEVELS.HIGH;
        heroToken.estimatedWaitMin = 48;
        NotificationService.sendFarmerNotification('FMR-1002', {
          title: 'High Congestion Alert ⚠️',
          body: 'Sudden influx of arrivals detected at Pune Mandi. Dynamic slot optimization recommended.',
          type: 'WARNING',
          channel: 'ALL'
        });
      }
      await broadcastCentreAndFarmerUpdates(io, centreId, 'A-127', 'Congestion spike simulated!');
    });

    socket.on('demo:optimize', async ({ centreId = 'PC-PUNE-01' }) => {
      if (!checkRole(socket, [USER_ROLES.CENTRE_ADMIN, USER_ROLES.DISTRICT_ADMIN, USER_ROLES.SYSTEM_ADMIN], 'demo:optimize')) return;

      await SlotOptimizerService.applyOptimization(centreId);
      const heroToken = await dualModeStore.getToken('A-127');
      if (heroToken) {
        heroToken.predictedCongestion = CONGESTION_LEVELS.LOW;
        heroToken.estimatedWaitMin = 21;
        NotificationService.sendFarmerNotification('FMR-1002', {
          title: 'Slots Optimized ✨',
          body: 'Mandi workload rebalanced. Your arrival slot remains on schedule for 10:30 AM.',
          type: 'SUCCESS',
          channel: 'ALL'
        });
      }
      await broadcastCentreAndFarmerUpdates(io, centreId, 'A-127', 'Queue optimization applied.');
    });

    socket.on('demo:reset', async () => {
      if (!checkRole(socket, [USER_ROLES.CENTRE_ADMIN, USER_ROLES.DISTRICT_ADMIN, USER_ROLES.SYSTEM_ADMIN], 'demo:reset')) return;

      await dualModeStore.initSeedData();
      await broadcastCentreAndFarmerUpdates(io, 'PC-PUNE-01', 'A-127', 'Demo simulation reset to initial baseline.');
    });
  });
}

export async function broadcastCentreAndFarmerUpdates(io, centreId = 'PC-PUNE-01', targetTokenNumber = 'A-127', toastMessage = null) {
  const { queueState, recommendation } = await QueueIntelligenceService.analyzeCentre(centreId);
  
  io.to(`centre:${centreId}`).emit('queue:update', {
    ...queueState,
    toastMessage
  });

  if (recommendation) {
    io.to(`centre:${centreId}`).emit('ai:recommendation', recommendation);
  }

  const heroToken = await dualModeStore.getToken(targetTokenNumber);
  if (heroToken) {
    const eta = await QueueIntelligenceService.calculateFarmerETA(targetTokenNumber, centreId);
    io.to(`farmer:${targetTokenNumber}`).emit('eta:update', eta);
    io.to(`farmer:${targetTokenNumber}`).emit('token:update', heroToken);
  }
  io.emit('global:telemetry', { queueState });
}


