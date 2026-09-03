import { QueueIntelligenceService } from '../services/queueIntelligence.js';
import { AIInferenceService } from '../services/aiInferenceService.js';

export const queueController = {
  getLiveQueue: async (req, res) => {
    const { centreId = 'PC-PUNE-01' } = req.query;
    const queueState = await QueueIntelligenceService.getCentreQueueState(centreId);
    return res.json({ success: true, ...queueState });
  },

  getFarmerETA: async (req, res) => {
    const { tokenNumber } = req.params;
    const { centreId = 'PC-PUNE-01' } = req.query;
    const eta = await QueueIntelligenceService.calculateFarmerETA(tokenNumber, centreId);
    if (!eta) return res.status(404).json({ error: 'Token not found' });

    // Enhance with AI explainability
    const aiPrediction = await AIInferenceService.predictWaitingTime({
      queueLength: eta.peopleAhead,
      activeCounters: eta.activeCounters,
      avgProcessingTime: eta.avgProcessingTimeMin,
      cropType: eta.cropType || 'WHEAT'
    });

    return res.json({
      success: true,
      eta: {
        ...eta,
        aiPrediction
      }
    });
  }
};
