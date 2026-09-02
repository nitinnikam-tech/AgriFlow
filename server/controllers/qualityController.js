import { dualModeStore } from '../utils/dualModeStore.js';
import { TOKEN_STATUS, CROPS_CONFIG } from '../config/constants.js';

export const qualityController = {
  submitInspection: (req, res) => {
    const {
      tokenNumber,
      netWeightKg = 520,
      moisturePercent = 11.8,
      grade = 'A',
      foreignMatterPercent = 0.5,
      inspectorName = 'Vandana Kulkarni',
      remarks = 'Complies with DoCA Fair Average Quality (FAQ) standards.'
    } = req.body;

    const token = dualModeStore.getToken(tokenNumber);
    if (!token) return res.status(404).json({ error: 'Token not found' });

    const cropConfig = CROPS_CONFIG[token.cropType] || { mspPerQuintal: 2400, moistureThreshold: 12.0 };
    const isApproved = Number(moisturePercent) <= (cropConfig.moistureThreshold + 1.0);

    const qualityRecord = {
      id: `QI-${Date.now()}`,
      tokenNumber,
      cropType: token.cropType,
      netWeightKg: Number(netWeightKg),
      moisturePercent: Number(moisturePercent),
      grade,
      foreignMatterPercent: Number(foreignMatterPercent),
      status: isApproved ? 'APPROVED' : 'CONDITIONAL_APPROVAL',
      inspectorName,
      remarks,
      inspectedAt: new Date().toISOString()
    };

    dualModeStore.qualityInspections.set(tokenNumber, qualityRecord);
    token.qualityDetails = qualityRecord;
    token.status = TOKEN_STATUS.PROCURED;

    const ratePerKg = cropConfig.mspPerQuintal / 100;
    const totalAmountInr = Math.round(Number(netWeightKg) * ratePerKg);
    token.paymentDetails = {
      estimatedAmountInr: totalAmountInr,
      ratePerQuintal: cropConfig.mspPerQuintal,
      status: 'PROCESSING',
      transactionRef: `AGF-PFMS-${Math.floor(100000 + Math.random() * 900000)}`
    };

    token.procurementTimeline?.forEach(step => {
      if (['COUNTER_CALL', 'QUALITY_WEIGHING', 'PROCURED'].includes(step.stage)) {
        step.isCompleted = true;
        step.timestamp = new Date().toISOString();
      }
    });

    return res.json({
      success: true,
      message: 'Quality inspection and weighing verified successfully.',
      qualityRecord,
      token
    });
  }
};
