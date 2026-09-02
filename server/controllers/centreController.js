import { dualModeStore } from '../utils/dualModeStore.js';
import { QueueIntelligenceService } from '../services/queueIntelligence.js';

export const centreController = {
  getAllCentres: (req, res) => {
    const centres = dualModeStore.getAllCentres();
    return res.json({ success: true, centres });
  },

  getCentreById: (req, res) => {
    const { id } = req.params;
    const centre = dualModeStore.getCentre(id);
    if (!centre) return res.status(404).json({ error: 'Centre not found' });
    const queueState = QueueIntelligenceService.getCentreQueueState(id);
    return res.json({ success: true, centre, queueState });
  },

  getDigitalTwinTelemetry: (req, res) => {
    const { id } = req.params;
    const centreId = id || 'PC-PUNE-01';
    const queueState = QueueIntelligenceService.getCentreQueueState(centreId);

    const zones = [
      { id: 'ZONE_ENTRY', name: 'Mandi Main Entry & Security', occupancy: 8, maxCapacity: 25, status: 'NORMAL', avgTimeMin: 1.5 },
      { id: 'ZONE_CHECKIN', name: 'QR & Token Check-In Kiosks', occupancy: 6, maxCapacity: 15, status: 'NORMAL', avgTimeMin: 2.0 },
      { id: 'ZONE_WAITING', name: 'Farmer Waiting Lounge', occupancy: queueState.waitingCount, maxCapacity: 60, status: queueState.waitingCount > 35 ? 'HIGH' : 'NORMAL', avgTimeMin: queueState.avgProcessingTimeMin * 3 },
      { id: 'ZONE_COUNTERS', name: 'Active Procurement Counters (1-4)', occupancy: queueState.processingCount, maxCapacity: 6, status: 'OPTIMAL', avgTimeMin: queueState.avgProcessingTimeMin },
      { id: 'ZONE_QUALITY', name: 'Quality Inspection & Moisture Lab', occupancy: 4, maxCapacity: 10, status: 'NORMAL', avgTimeMin: 3.5 },
      { id: 'ZONE_WEIGHBRIDGE', name: 'Electronic Weighbridge Scale', occupancy: 3, maxCapacity: 8, status: 'NORMAL', avgTimeMin: 2.5 },
      { id: 'ZONE_EXIT', name: 'Receipt & Mandi Exit Gate', occupancy: 5, maxCapacity: 20, status: 'CLEAR', avgTimeMin: 1.0 }
    ];

    return res.json({
      success: true,
      centreId,
      centreName: queueState.centreName,
      activeCounters: queueState.activeCountersCount,
      totalWaiting: queueState.waitingCount,
      zones,
      lastUpdated: new Date().toISOString()
    });
  },

  getCrowdForecast: (req, res) => {
    const { id } = req.params;
    const centreId = id || 'PC-PUNE-01';

    const hourlyForecast = [
      { hour: '08:00', label: '08:00 AM', status: 'LOW', expectedArrivals: 18, color: '#10B981' },
      { hour: '09:00', label: '09:00 AM', status: 'HIGH', expectedArrivals: 52, color: '#EF4444' },
      { hour: '10:00', label: '10:00 AM', status: 'HIGH', expectedArrivals: 58, color: '#EF4444' },
      { hour: '11:00', label: '11:00 AM', status: 'LOW', expectedArrivals: 24, color: '#10B981' },
      { hour: '12:00', label: '12:00 PM', status: 'LOW', expectedArrivals: 20, color: '#10B981' },
      { hour: '13:00', label: '01:00 PM', status: 'MEDIUM', expectedArrivals: 34, color: '#F59E0B' },
      { hour: '14:00', label: '02:00 PM', status: 'HIGH', expectedArrivals: 48, color: '#EF4444' },
      { hour: '15:00', label: '03:00 PM', status: 'MEDIUM', expectedArrivals: 32, color: '#F59E0B' },
      { hour: '16:00', label: '04:00 PM', status: 'LOW', expectedArrivals: 15, color: '#10B981' }
    ];

    return res.json({
      success: true,
      centreId,
      hourlyForecast,
      recommendedBestHours: ['11:00 AM - 01:00 PM', '04:00 PM - 05:00 PM']
    });
  }
};
