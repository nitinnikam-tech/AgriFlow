import { dualModeStore } from '../utils/dualModeStore.js';
import { TOKEN_STATUS } from '../config/constants.js';

export const paymentController = {
  getPaymentStatus: (req, res) => {
    const { tokenNumber } = req.params;
    const token = dualModeStore.getToken(tokenNumber);
    if (!token) return res.status(404).json({ error: 'Token not found' });

    const farmer = dualModeStore.getFarmer(token.farmerId) || {
      bankDetails: { bankName: 'State Bank of India', ifsc: 'SBIN0001234', accountLast4: '7712' }
    };

    const payment = token.paymentDetails || {
      estimatedAmountInr: 12480,
      status: 'PROCESSING',
      transactionRef: 'AGF-PFMS-2026-98124'
    };

    return res.json({
      success: true,
      tokenNumber,
      farmerName: token.farmerName,
      cropType: token.cropType,
      netWeightKg: token.quantityKg || 520,
      payment,
      bankDetails: farmer.bankDetails,
      timeline: [
        { title: 'Procurement Verified & Approved', timestamp: '2026-09-02T10:45:00Z', isCompleted: true },
        { title: 'PFMS / DBT Direct Payout Initiated', timestamp: '2026-09-02T10:50:00Z', isCompleted: true },
        { title: 'Bank Settlement & NPCI Clearing', timestamp: '2026-09-02T11:00:00Z', isCompleted: payment.status === 'COMPLETED' },
        { title: 'Amount Credited to Farmer Account', timestamp: payment.status === 'COMPLETED' ? '2026-09-02T11:15:00Z' : null, isCompleted: payment.status === 'COMPLETED' }
      ]
    });
  },

  simulatePaymentCredit: (req, res) => {
    const { tokenNumber } = req.body;
    const token = dualModeStore.getToken(tokenNumber);
    if (!token) return res.status(404).json({ error: 'Token not found' });

    token.status = TOKEN_STATUS.PAYMENT_COMPLETED;
    token.paymentDetails = {
      ...token.paymentDetails,
      status: 'COMPLETED',
      creditedAt: new Date().toISOString(),
      transactionRef: token.paymentDetails?.transactionRef || `AGF-DBT-${Date.now()}`
    };

    const payStep = token.procurementTimeline?.find(s => s.stage === 'PAYMENT_CREDITED');
    if (payStep) {
      payStep.isCompleted = true;
      payStep.timestamp = new Date().toISOString();
    }

    return res.json({
      success: true,
      message: 'Direct Benefit Transfer (DBT) payment simulated and credited.',
      payment: token.paymentDetails
    });
  }
};
