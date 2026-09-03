import { repository as dualModeStore } from '../repositories/index.js';

export class NotificationService {
  static async sendFarmerNotification(farmerId, { title, body, type = 'INFO', channel = 'ALL' }) {
    const notif = {
      title,
      body,
      type,
      channel,
      smsSimulated: channel === 'SMS' || channel === 'ALL' ? `[SMS-DoCA] ${body}` : null,
      whatsAppSimulated: channel === 'WHATSAPP' || channel === 'ALL' ? `🌾 *AgriFlow Update*:\n${body}` : null
    };

    return await dualModeStore.addNotification(farmerId, notif);
  }

  static async broadcastQueueImprovement(centreId = 'PC-PUNE-01', newArrivalTime = '10:38 AM') {
    const heroFarmerId = 'FMR-1002';
    return this.sendFarmerNotification(heroFarmerId, {
      title: 'Queue Conditions Improved ⚡',
      body: `Counter 5 has been activated. Your estimated waiting time dropped to 19 mins. Recommended arrival: ${newArrivalTime}.`,
      type: 'QUEUE_IMPROVED',
      channel: 'ALL'
    });
  }
}
