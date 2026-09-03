import { Token } from '../models/Token.js';
import { Centre } from '../models/Centre.js';
import { User } from '../models/User.js';
import { Farmer } from '../models/Farmer.js';
import { Slot } from '../models/Slot.js';
import { Counter } from '../models/Counter.js';
import { Notification } from '../models/Notification.js';
import { dualModeStore } from '../utils/dualModeStore.js';

// We implement the same interface as dualModeStore but using Mongoose models.
// NOTE: For demo scenario step and simulation flag, we keep them in memory even in MongoDB mode 
// to ensure the Demo SIH presentation is fast and flawless.

class MongoRepository {

  // --- Tokens ---
  async getToken(tokenNumber) {
    const t = await Token.findOne({ tokenNumber }).lean();
    return t;
  }
  async getTokensByCentre(centreId) {
    return await Token.find({ centreId }).lean();
  }
  async saveToken(tokenNumber, tokenData) {
    return await Token.findOneAndUpdate({ tokenNumber }, tokenData, { upsert: true, new: true }).lean();
  }
  async getTokensCount() {
    return await Token.countDocuments();
  }
  async getAllTokens() {
    return await Token.find().lean();
  }

  // --- Centres ---
  async getCentre(centreId) {
    return await Centre.findOne({ id: centreId }).lean();
  }
  async getAllCentres() {
    return await Centre.find().lean();
  }
  async saveCentre(centreData) {
    return await Centre.findOneAndUpdate({ id: centreData.id }, centreData, { upsert: true, new: true }).lean();
  }

  // --- Counters ---
  async getCountersByCentre(centreId) {
    return await Counter.find({ centreId }).lean();
  }
  async getCounter(counterId) {
    return await Counter.findOne({ id: counterId }).lean();
  }
  async saveCounter(counterId, counterData) {
    return await Counter.findOneAndUpdate({ id: counterId }, counterData, { upsert: true, new: true }).lean();
  }

  // --- Slots ---
  async getSlotsByCentre(centreId) {
    return await Slot.find({ centreId }).lean();
  }
  async getSlot(slotId) {
    return await Slot.findOne({ id: slotId }).lean();
  }
  async saveSlot(slotId, slotData) {
    return await Slot.findOneAndUpdate({ id: slotId }, slotData, { upsert: true, new: true }).lean();
  }

  // --- Users ---
  async getUserByEmail(email) {
    return await User.findOne({ email }).lean();
  }
  async saveUser(userData) {
    return await User.findOneAndUpdate({ email: userData.email }, userData, { upsert: true, new: true }).lean();
  }
  async getAllUsers() {
    return await User.find().lean();
  }

  // --- Farmers ---
  async getFarmer(farmerId) {
    return await Farmer.findOne({ id: farmerId }).lean();
  }
  async saveFarmer(farmerData) {
    return await Farmer.findOneAndUpdate({ id: farmerData.id }, farmerData, { upsert: true, new: true }).lean();
  }

  // --- Notifications ---
  async getFarmerNotifications(farmerId) {
    return await Notification.find({ farmerId }).sort({ timestamp: -1 }).lean();
  }
  async addNotification(farmerId, notification) {
    const notif = new Notification({
      id: `NOTIF-${Date.now()}`,
      farmerId,
      timestamp: new Date(),
      read: false,
      ...notification
    });
    await notif.save();
    return await this.getFarmerNotifications(farmerId);
  }

  // --- Quality Inspections ---
  async saveQualityInspection(tokenNumber, record) {
    // Quality details are embedded in the Token model
    const token = await Token.findOneAndUpdate(
      { tokenNumber },
      { qualityDetails: record },
      { new: true }
    ).lean();
    return record;
  }

  // --- Demo Variables (In-Memory for performance during pitch) ---
  async getDemoScenarioStep() { return await dualModeStore.getDemoScenarioStep(); }
  async setDemoScenarioStep(step) { return await dualModeStore.setDemoScenarioStep(step); }
  async getIsSimulatingCongestion() { return await dualModeStore.getIsSimulatingCongestion(); }
  async setIsSimulatingCongestion(value) { return await dualModeStore.setIsSimulatingCongestion(value); }
  
  // --- AI Recommendations (Memory-based for Demo speed) ---
  async getRecommendation(id) { return dualModeStore.getRecommendation(id); }
  async getRecommendationsByCentre(centreId) { return dualModeStore.getRecommendationsByCentre(centreId); }
  async saveRecommendation(rec) { return dualModeStore.saveRecommendation(rec); }

  async initSeedData() {
    dualModeStore.initSeedData();
    
    // Sync Centres
    const centreOps = dualModeStore.getAllCentres().map(c => ({
      updateOne: { filter: { id: c.id }, update: { $set: c }, upsert: true }
    }));
    if (centreOps.length > 0) await Centre.bulkWrite(centreOps);

    // Sync Counters
    const counters = Array.from(dualModeStore.counters.values());
    const counterOps = counters.map(c => ({
      updateOne: { filter: { id: c.id }, update: { $set: c }, upsert: true }
    }));
    if (counterOps.length > 0) await Counter.bulkWrite(counterOps);

    // Sync Farmers
    const farmers = Array.from(dualModeStore.farmers.values());
    const farmerOps = farmers.map(f => ({
      updateOne: { filter: { id: f.id }, update: { $set: f }, upsert: true }
    }));
    if (farmerOps.length > 0) await Farmer.bulkWrite(farmerOps);

    // Sync Users
    const users = Array.from(dualModeStore.users.values());
    const userOps = users.map(u => ({
      updateOne: { filter: { email: u.email }, update: { $set: u }, upsert: true }
    }));
    if (userOps.length > 0) await User.bulkWrite(userOps);

    // Sync Slots
    const slots = Array.from(dualModeStore.slots.values());
    const slotOps = slots.map(s => ({
      updateOne: { filter: { id: s.id }, update: { $set: s }, upsert: true }
    }));
    if (slotOps.length > 0) await Slot.bulkWrite(slotOps);

    // Sync Tokens
    const tokens = dualModeStore.getAllTokens();
    const tokenOps = tokens.map(t => ({
      updateOne: { filter: { tokenNumber: t.tokenNumber }, update: { $set: t }, upsert: true }
    }));
    if (tokenOps.length > 0) await Token.bulkWrite(tokenOps);
  }
}

export const mongoRepository = new MongoRepository();
