import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  centreId: { type: String, required: true, index: true },
  counterNumber: Number,
  type: String,
  status: String, // 'PROCESSING', 'IDLE', 'PAUSED', 'INACTIVE'
  currentToken: String,
  currentCrop: String,
  tokensProcessedToday: Number,
  officialId: String,
  officialName: String
}, { timestamps: true });

export const Counter = mongoose.model('Counter', counterSchema);
