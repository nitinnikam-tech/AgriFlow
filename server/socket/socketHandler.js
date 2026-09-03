import { dualModeStore } from '../utils/dualModeStore.js';
import { QueueIntelligenceService } from '../services/queueIntelligence.js';
import { SlotOptimizerService } from '../services/slotOptimizer.js';
import { NotificationService } from '../services/notificationService.js';
import { TOKEN_STATUS, CONGESTION_LEVELS } from '../config/constants.js';

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('join:centre', (centreId = 'PC-PUNE-01') => {
      socket.join(`centre:${centreId}`);
      const queueState = QueueIntelligenceService.getCentreQueueState(centreId);
      socket.emit('queue:update', queueState);
    });

    socket.on('join:farmer', ({ tokenNumber, centreId = 'PC-PUNE-01' }) => {
      socket.join(`farmer:${tokenNumber}`);
      const eta = QueueIntelligenceService.calculateFarmerETA(tokenNumber, centreId);
      socket.emit('eta:update', eta);
    });

    socket.on('token:call_next', ({ counterId, centreId = 'PC-PUNE-01' }) => {
      const counter = dualModeStore.counters.get(counterId);
      if (!counter) return;

      const allWaiting = Array.from(dualModeStore.tokens.values())
        .filter(t => t.centreId === centreId && t.status === TOKEN_STATUS.WAITING)
        .sort((a, b) => a.queuePosition - b.queuePosition);

      if (allWaiting.length > 0) {
        const nextToken = allWaiting[0];
        nextToken.status = TOKEN_STATUS.PROCESSING;
        nextToken.counterId = counterId;
        counter.status = 'PROCESSING';
        counter.currentToken = nextToken.tokenNumber;
        counter.currentCrop = nextToken.cropType;

        broadcastCentreAndFarmerUpdates(io, centreId, nextToken.tokenNumber, `Token ${nextToken.tokenNumber} called to Counter ${counter.counterNumber}`);
      }
    });

    socket.on('token:complete', ({ counterId, tokenNumber, centreId = 'PC-PUNE-01' }) => {
      const counter = dualModeStore.counters.get(counterId);
      const token = dualModeStore.getToken(tokenNumber);

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

      const heroToken = dualModeStore.getToken('A-127');
      if (heroToken && heroToken.status === TOKEN_STATUS.WAITING) {
        if (heroToken.peopleAhead > 1) {
          heroToken.peopleAhead -= 1;
          heroToken.estimatedWaitMin = Math.max(1, Math.round((heroToken.peopleAhead * 5.8) / (QueueIntelligenceService.getCentreQueueState(centreId).activeCountersCount || 4)));
        }
      }

      broadcastCentreAndFarmerUpdates(io, centreId, tokenNumber, `Token ${tokenNumber} processing completed.`);
    });

    socket.on('counter:toggle', ({ counterId, centreId = 'PC-PUNE-01' }) => {
      const counter = dualModeStore.counters.get(counterId);
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

    socket.on('counter:add', ({ centreId = 'PC-PUNE-01' }) => {
      const counters = dualModeStore.getCountersByCentre(centreId);
      const idleOrInactive = counters.find(c => c.status === 'IDLE' || c.status === 'INACTIVE');
      if (idleOrInactive) {
        idleOrInactive.status = 'PROCESSING';
        idleOrInactive.currentToken = 'A-113';
        const tok113 = dualModeStore.getToken('A-113');
        if (tok113) tok113.status = TOKEN_STATUS.PROCESSING;

        const heroToken = dualModeStore.getToken('A-127');
        if (heroToken) {
          heroToken.activeCounters = 5;
          heroToken.estimatedWaitMin = 19;
          heroToken.recommendedArrivalTime = '10:38 AM';
          heroToken.predictedCongestion = CONGESTION_LEVELS.MEDIUM;
          NotificationService.broadcastQueueImprovement(centreId, '10:38 AM');
        }

        broadcastCentreAndFarmerUpdates(io, centreId, 'A-127', 'Counter 5 activated! Queue wait time reduced.');
      }
    });

    socket.on('demo:trigger_spike', ({ centreId = 'PC-PUNE-01' }) => {
      dualModeStore.isSimulatingCongestion = true;
      const heroToken = dualModeStore.getToken('A-127');
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
      broadcastCentreAndFarmerUpdates(io, centreId, 'A-127', 'Congestion spike simulated!');
    });

    socket.on('demo:optimize', ({ centreId = 'PC-PUNE-01' }) => {
      SlotOptimizerService.applyOptimization(centreId);
      const heroToken = dualModeStore.getToken('A-127');
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
      broadcastCentreAndFarmerUpdates(io, centreId, 'A-127', 'Queue optimization applied.');
    });

    socket.on('demo:reset', () => {
      dualModeStore.initSeedData();
      broadcastCentreAndFarmerUpdates(io, 'PC-PUNE-01', 'A-127', 'Demo simulation reset to initial baseline.');
    });
  });
}

export function broadcastCentreAndFarmerUpdates(io, centreId = 'PC-PUNE-01', targetTokenNumber = 'A-127', toastMessage = null) {
  const queueState = QueueIntelligenceService.getCentreQueueState(centreId);
  io.to(`centre:${centreId}`).emit('queue:update', {
    ...queueState,
    toastMessage
  });

  const heroTokenNumber = targetTokenNumber || 'A-127';
  const eta = QueueIntelligenceService.calculateFarmerETA(heroTokenNumber, centreId);
  const heroToken = dualModeStore.getToken(heroTokenNumber);

  io.to(`farmer:${heroTokenNumber}`).emit('eta:update', eta);
  io.to(`farmer:${heroTokenNumber}`).emit('token:update', heroToken);
  io.emit('global:telemetry', { queueState, eta });
}
