import { dualModeStore } from '../utils/dualModeStore.js';
import { SlotOptimizerService } from '../services/slotOptimizer.js';

export const slotController = {
  getSlots: (req, res) => {
    const { centreId = 'PC-PUNE-01' } = req.query;
    const slots = dualModeStore.getSlotsByCentre(centreId);
    return res.json({ success: true, slots });
  },

  getOptimizationProposal: (req, res) => {
    const { centreId = 'PC-PUNE-01' } = req.query;
    const proposal = SlotOptimizerService.getOptimizationProposal(centreId);
    return res.json({ success: true, proposal });
  },

  applyOptimization: (req, res) => {
    const { centreId = 'PC-PUNE-01' } = req.body;
    const result = SlotOptimizerService.applyOptimization(centreId);
    return res.json(result);
  }
};
