import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  passwordHash: { type: String, required: true },
  centreId: String,
  counterId: String,
  district: String,
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
