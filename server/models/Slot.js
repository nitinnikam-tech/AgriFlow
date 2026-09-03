import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  centreId: { type: String, required: true, index: true },
  date: String,
  timeWindow: String,
  capacity: Number,
  bookedCount: Number,
  isAvailable: Boolean,
  predictedCongestion: String,
  isRecommended: Boolean
}, { timestamps: true });

export const Slot = mongoose.model('Slot', slotSchema);
