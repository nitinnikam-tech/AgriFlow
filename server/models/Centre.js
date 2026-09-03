import mongoose from 'mongoose';

const centreSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: String,
  district: String,
  state: String,
  dailyCapacityQuintals: Number,
  capacityUtilization: Number,
  activeCountersCount: Number,
  status: String,
  metrics: {
    averageWaitTimeMin: Number,
    totalProcuredTodayQuintals: Number,
    congestionLevel: String,
    completedTokensToday: Number
  }
}, { timestamps: true });

export const Centre = mongoose.model('Centre', centreSchema);
