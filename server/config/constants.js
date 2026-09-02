export const TOKEN_STATUS = {
  BOOKED: 'BOOKED',
  WAITING: 'WAITING',
  APPROACHING: 'APPROACHING',
  CHECKED_IN: 'CHECKED_IN',
  PROCESSING: 'PROCESSING',
  QUALITY_CHECK: 'QUALITY_CHECK',
  PROCURED: 'PROCURED',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const USER_ROLES = {
  FARMER: 'FARMER',
  OFFICER: 'OFFICER',
  CENTRE_ADMIN: 'CENTRE_ADMIN',
  DISTRICT_ADMIN: 'DISTRICT_ADMIN',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN'
};

export const CONGESTION_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export const CROPS_CONFIG = {
  WHEAT: { name: 'Wheat (गेहूं / गहू)', code: 'WHEAT', mspPerQuintal: 2275, avgProcTimeMin: 5.5, moistureThreshold: 12.0 },
  PADDY: { name: 'Paddy / Rice (धान / भात)', code: 'PADDY', mspPerQuintal: 2183, avgProcTimeMin: 6.2, moistureThreshold: 17.0 },
  SOYBEAN: { name: 'Soybean (सोयाबीन)', code: 'SOYBEAN', mspPerQuintal: 4600, avgProcTimeMin: 5.0, moistureThreshold: 12.0 },
  COTTON: { name: 'Cotton (कपास / कापूस)', code: 'COTTON', mspPerQuintal: 6620, avgProcTimeMin: 7.0, moistureThreshold: 8.0 },
  CHANA: { name: 'Gram / Chana (चना / हरभरा)', code: 'CHANA', mspPerQuintal: 5440, avgProcTimeMin: 4.8, moistureThreshold: 14.0 },
  MAIZE: { name: 'Maize (मक्का / मका)', code: 'MAIZE', mspPerQuintal: 2090, avgProcTimeMin: 5.2, moistureThreshold: 14.0 }
};

export const GEOFENCE_RADIUS_METERS = 500;
export const DEFAULT_AVG_PROCESSING_TIME = 5.8;
