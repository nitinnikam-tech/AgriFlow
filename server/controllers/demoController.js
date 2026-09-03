import { repository as dualModeStore } from '../repositories/index.js';
import { QueueIntelligenceService } from '../services/queueIntelligence.js';
import { SlotOptimizerService } from '../services/slotOptimizer.js';
import { NotificationService } from '../services/notificationService.js';
import { CONGESTION_LEVELS, TOKEN_STATUS } from '../config/constants.js';

export const demoController = {
  getDemoState: async (req, res) => {
    const queueState = await QueueIntelligenceService.getCentreQueueState('PC-PUNE-01');
    const heroToken = await dualModeStore.getToken('A-127');
    const notifications = await dualModeStore.getFarmerNotifications('FMR-1002');

    return res.json({
      success: true,
      step: (await dualModeStore.getDemoScenarioStep()),
      isSimulatingCongestion: (await dualModeStore.getIsSimulatingCongestion()),
      queueState,
      heroToken,
      notifications
    });
  },

  advanceStep: async (req, res) => {
    const { step } = req.body;
    await dualModeStore.setDemoScenarioStep(Number(step));

    const heroToken = await dualModeStore.getToken('A-127');

    switch (Number(step)) {
      case 1:
        await dualModeStore.initSeedData();
        break;
      
      case 2:
        if (heroToken) {
          heroToken.peopleAhead = 17;
          heroToken.estimatedWaitMin = 29;
          heroToken.recommendedArrivalTime = '10:41 AM';
        }
        break;

      case 3:
        await dualModeStore.setIsSimulatingCongestion(true);
        if (heroToken) {
          heroToken.predictedCongestion = CONGESTION_LEVELS.HIGH;
          heroToken.estimatedWaitMin = 46;
          NotificationService.sendFarmerNotification('FMR-1002', {
            title: 'Mandi Congestion Alert ⚠️',
            body: 'High arrival volume detected at Pune Centre. Optimization proposal generated.',
            type: 'WARNING'
          });
        }
        break;

      case 4:
        await SlotOptimizerService.applyOptimization('PC-PUNE-01');
        break;

      case 5:
        const cnt5 = await dualModeStore.getCounter('CNT-PUN-05');
        if (cnt5) {
          cnt5.status = 'PROCESSING';
          cnt5.currentToken = 'A-113';
        }
        if (heroToken) {
          heroToken.activeCounters = 5;
          heroToken.estimatedWaitMin = 19;
          heroToken.recommendedArrivalTime = '10:38 AM';
          heroToken.predictedCongestion = CONGESTION_LEVELS.MEDIUM;
          NotificationService.broadcastQueueImprovement('PC-PUNE-01', '10:38 AM');
        }
        break;

      case 6:
        if (heroToken) {
          heroToken.status = TOKEN_STATUS.PROCESSING;
          heroToken.counterId = 'CNT-PUN-01';
          heroToken.peopleAhead = 0;
          heroToken.estimatedWaitMin = 0;
          NotificationService.sendFarmerNotification('FMR-1002', {
            title: 'Your Turn! Proceed to Counter 1 📢',
            body: 'Token A-127 called by Officer Sanjay Deshmukh for Wheat weighing and quality check.',
            type: 'URGENT'
          });
        }
        break;

      default:
        break;
    }

    return res.json({
      success: true,
      currentStep: (await dualModeStore.getDemoScenarioStep()),
      message: `Advanced to Demo Scenario Step ${step}`
    });
  },

  resetDemo: async (req, res) => {
    await dualModeStore.initSeedData();
    await dualModeStore.setDemoScenarioStep(0);
    await dualModeStore.setIsSimulatingCongestion(false);
    return res.json({
      success: true,
      message: 'Demo state successfully reset to default baseline.'
    });
  }
};
