import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location: String,
  primaryCrop: String
}, { timestamps: true });

export const Farmer = mongoose.model('Farmer', farmerSchema);
