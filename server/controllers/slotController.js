import { repository as dualModeStore } from '../repositories/index.js';
import { SlotOptimizerService } from '../services/slotOptimizer.js';

export const slotController = {
  getSlots: async (req, res) => {
    const { centreId = 'PC-PUNE-01' } = req.query;
    const slots = await dualModeStore.getSlotsByCentre(centreId);
    return res.json({ success: true, slots });
  },

  getOptimizationProposal: async (req, res) => {
    const { centreId = 'PC-PUNE-01' } = req.query;
    const proposal = SlotOptimizerService.getOptimizationProposal(centreId);
    return res.json({ success: true, proposal });
  },

  applyOptimization: async (req, res) => {
    const { centreId = 'PC-PUNE-01' } = req.body;
    const result = await SlotOptimizerService.applyOptimization(centreId);
    return res.json(result);
  }
};
