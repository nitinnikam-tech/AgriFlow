import { repository as dualModeStore } from '../repositories/index.js';
import { QueueIntelligenceService } from '../services/queueIntelligence.js';
import { broadcastCentreAndFarmerUpdates } from '../socket/socketHandler.js';
import { USER_ROLES } from '../config/constants.js';
import { NotificationService } from '../services/notificationService.js';

export const aiController = {
  getRecommendations: async (req, res) => {
    try {
      const centreId = req.user?.centreId || 'PC-PUNE-01';
      // First, trigger analysis to generate fresh ones if needed
      await QueueIntelligenceService.analyzeCentre(centreId);
      
      const recommendations = dualModeStore.getRecommendationsByCentre(centreId);
      return res.json({ success: true, data: recommendations });
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
      return res.status(500).json({ success: false, message: 'Server error fetching intelligence' });
    }
  },

  approveRecommendation: async (req, res) => {
    try {
      const { id } = req.params;
      const recommendation = dualModeStore.getRecommendation(id);

      if (!recommendation) {
        return res.status(404).json({ success: false, message: 'Recommendation not found' });
      }

      if (recommendation.status !== 'PENDING') {
        return res.status(400).json({ success: false, message: `Recommendation already ${recommendation.status}` });
      }

      // Execute Action
      if (recommendation.type === 'ACTIVATE_STANDBY_COUNTER') {
        const counter = await dualModeStore.getCounter(recommendation.targetCounterId);
        if (counter) {
          counter.status = 'PROCESSING';
          counter.currentToken = 'A-113'; // Mock next token for demo
          await dualModeStore.saveCounter(counter.id, counter);
          
          // Re-calculate hero token explicitly for demo
          const heroToken = await dualModeStore.getToken('A-127');
          if (heroToken) {
            heroToken.activeCounters = (heroToken.activeCounters || 4) + 1;
            const qState = await QueueIntelligenceService.getCentreQueueState(recommendation.centreId);
            heroToken.estimatedWaitMin = Math.max(1, Math.round((heroToken.peopleAhead * 5.8) / (qState.activeCountersCount)));
            
            // Send Notification to farmer
            await NotificationService.broadcastQueueImprovement(recommendation.centreId, heroToken.recommendedArrivalTime);
          }

          // Broadcast the updates via Socket.IO
          if (req.app.get('io')) {
            await broadcastCentreAndFarmerUpdates(req.app.get('io'), recommendation.centreId, 'A-127', 'Counter activated successfully based on AI recommendation.');
          }
        }
      }

      recommendation.status = 'APPROVED';
      await dualModeStore.saveRecommendation(recommendation);

      return res.json({ success: true, message: 'Recommendation approved and executed successfully', data: recommendation });
    } catch (err) {
      console.error('Error approving recommendation:', err);
      return res.status(500).json({ success: false, message: 'Server error approving recommendation' });
    }
  },

  dismissRecommendation: async (req, res) => {
    try {
      const { id } = req.params;
      const recommendation = dualModeStore.getRecommendation(id);

      if (!recommendation) {
        return res.status(404).json({ success: false, message: 'Recommendation not found' });
      }

      recommendation.status = 'DISMISSED';
      await dualModeStore.saveRecommendation(recommendation);

      return res.json({ success: true, message: 'Recommendation dismissed successfully' });
    } catch (err) {
      console.error('Error dismissing recommendation:', err);
      return res.status(500).json({ success: false, message: 'Server error dismissing recommendation' });
    }
  },
  
  getHealth: async (req, res) => {
    return res.json({
      success: true,
      data: {
        model: 'Random Forest ETA',
        status: 'Healthy',
        lastLoaded: new Date().toISOString(),
        features: 10,
        trainingRecords: 5000,
        mae: '4.27 min',
        r2: 0.9774,
        disclaimer: 'Validation metrics on synthetic prototype dataset'
      }
    });
  }
};
