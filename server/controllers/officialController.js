import { repository as dualModeStore } from '../repositories/index.js';
import { QueueIntelligenceService } from '../services/queueIntelligence.js';
import { TOKEN_STATUS } from '../config/constants.js';

export const officialController = {
  getCounters: async (req, res) => {
    const { centreId = 'PC-PUNE-01' } = req.query;
    const counters = await dualModeStore.getCountersByCentre(centreId);
    return res.json({ success: true, counters });
  },

  getCounterWorkloadBalancing: async (req, res) => {
    const { centreId = 'PC-PUNE-01' } = req.query;
    const counters = await dualModeStore.getCountersByCentre(centreId);

    const overloaded = counters.find(c => c.utilizationPercent > 85);
    const underloaded = counters.find(c => c.status === 'PROCESSING' && c.utilizationPercent < 60);

    const recommendation = overloaded ? {
      isNeeded: true,
      alertMessage: `Counter ${overloaded.counterNumber} is heavily utilized (${overloaded.utilizationPercent}%).`,
      actionSuggestion: `Route next eligible ${overloaded.currentCrop || 'crop'} token to Counter ${underloaded ? underloaded.counterNumber : 3} or activate reserve Counter 5.`
    } : {
      isNeeded: false,
      alertMessage: 'Counter workloads are well-balanced across active terminals.',
      actionSuggestion: 'Maintain current routing speed.'
    };

    return res.json({
      success: true,
      counters,
      recommendation
    });
  }
};
