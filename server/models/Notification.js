import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  farmerId: { type: String, required: true, index: true },
  title: String,
  body: String,
  type: String,
  timestamp: Date,
  read: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
