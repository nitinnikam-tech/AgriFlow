import mongoose from 'mongoose';

const procurementStepSchema = new mongoose.Schema({
  stage: String,
  label: String,
  timestamp: Date,
  isCompleted: Boolean
}, { _id: false });

const tokenSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  tokenNumber: { type: String, required: true, unique: true },
  centreId: { type: String, required: true, index: true },
  centreName: String,
  farmerId: { type: String, required: true, index: true },
  farmerName: String,
  farmerPhone: String,
  cropType: String,
  quantityKg: Number,
  expectedBags: Number,
  slotId: { type: String, index: true },
  slotTimeWindow: String,
  date: String,
  status: { type: String, required: true, index: true },
  queuePosition: { type: Number, default: 0 },
  peopleAhead: { type: Number, default: 0 },
  activeCounters: Number,
  avgProcessingTimeMin: Number,
  estimatedWaitMin: { type: Number, default: 0 },
  recommendedArrivalTime: String,
  predictedCongestion: String,
  confidenceScore: Number,
  qrCodeData: String,
  geofenceStatus: {
    distanceMeters: Number,
    radiusMeters: Number,
    isInside: Boolean,
    statusText: String
  },
  procurementTimeline: [procurementStepSchema],
  counterId: String,
  qualityDetails: mongoose.Schema.Types.Mixed,
  paymentDetails: {
    estimatedAmountInr: Number,
    status: { type: String, default: 'PENDING' },
    transactionRef: String
  },
  startedAt: Date,
  completedAt: Date,
}, { timestamps: true });

export const Token = mongoose.model('Token', tokenSchema);
