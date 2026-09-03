import { repository as dualModeStore } from '../repositories/index.js';
import { QueueIntelligenceService } from '../services/queueIntelligence.js';

export const analyticsController = {
  getCentreDashboardStats: async (req, res) => {
    const { centreId = 'PC-PUNE-01' } = req.query;
    const queueState = await QueueIntelligenceService.getCentreQueueState(centreId);

    const hourlyArrivals = [
      { hour: '08:00', arrivals: 22, processed: 18, avgWaitMin: 12 },
      { hour: '09:00', arrivals: 48, processed: 38, avgWaitMin: 28 },
      { hour: '10:00', arrivals: 56, processed: 42, avgWaitMin: 34 },
      { hour: '11:00', arrivals: 30, processed: 36, avgWaitMin: 22 },
      { hour: '12:00', arrivals: 24, processed: 28, avgWaitMin: 16 },
      { hour: '13:00', arrivals: 32, processed: 30, avgWaitMin: 20 },
      { hour: '14:00', arrivals: 44, processed: 38, avgWaitMin: 26 },
      { hour: '15:00', arrivals: 28, processed: 32, avgWaitMin: 18 },
      { hour: '16:00', arrivals: 15, processed: 20, avgWaitMin: 10 }
    ];

    const cropDistribution = [
      { name: 'Wheat (गेहूं)', value: 45, color: '#F59E0B' },
      { name: 'Soybean (सोयाबीन)', value: 28, color: '#10B981' },
      { name: 'Gram/Chana (चना)', value: 18, color: '#3B82F6' },
      { name: 'Maize (मक्का)', value: 9, color: '#8B5CF6' }
    ];

    const counterEfficiency = [
      { counter: 'Counter 1 (Sanjay D.)', tokens: 54, avgMinutes: 5.4, utilization: 92 },
      { counter: 'Counter 2 (Vandana K.)', tokens: 48, avgMinutes: 6.1, utilization: 84 },
      { counter: 'Counter 3 (Rajesh S.)', tokens: 51, avgMinutes: 5.2, utilization: 78 },
      { counter: 'Counter 4 (Pooja G.)', tokens: 45, avgMinutes: 5.9, utilization: 81 }
    ];

    const anomalies = [
      {
        id: 'ANOM-01',
        type: 'COUNTER_SLOWDOWN',
        severity: 'MEDIUM',
        title: 'Counter 2 Processing Delay',
        description: 'Average processing time at Counter 2 is 6.1 mins (+17% above baseline due to manual Soybean moisture checks).',
        timestamp: '10:24 AM',
        actionTaken: 'Auto-balanced dry crop tokens to Counter 3.'
      },
      {
        id: 'ANOM-02',
        type: 'PEAK_SURGE_PREDICTED',
        severity: 'LOW',
        title: 'Upcoming 10:30 AM Inflow Surge',
        description: 'AI model predicts 30+ arrivals in next 30 minutes.',
        timestamp: '10:15 AM',
        actionTaken: 'Recommended standby readiness for Counter 5.'
      }
    ];

    return res.json({
      success: true,
      centreId,
      kpis: {
        farmersToday: queueState.totalBookedToday || 247,
        waiting: queueState.waitingCount,
        processing: queueState.processingCount,
        completed: queueState.completedCount || 198,
        avgWaitMinutes: 21,
        centreUtilizationPercent: 72,
        predictedPeakTime: '11:30 AM',
        totalProcuredKg: 102960,
        totalDisbursedLakhs: 24.7
      },
      hourlyArrivals,
      cropDistribution,
      counterEfficiency,
      anomalies
    });
  }
};
