import { dbConfig } from '../config/database.js';
import { mongoRepository } from './mongoRepository.js';
import { dualModeStore } from '../utils/dualModeStore.js'; // The existing memory store

class PersistenceManager {
  
  _getRepo() {
    if (dbConfig.mode === 'mongodb') {
      return mongoRepository;
    }
    return dualModeStore; // dualModeStore will be adapted to have async matching methods
  }

  // --- Tokens ---
  async getToken(tokenNumber) { return this._getRepo().getToken(tokenNumber); }
  async getTokensByCentre(centreId) { return this._getRepo().getTokensByCentre(centreId); }
  async saveToken(tokenNumber, tokenData) { return this._getRepo().saveToken(tokenNumber, tokenData); }
  async getTokensCount() { return this._getRepo().getTokensCount(); }
  async getAllTokens() { return this._getRepo().getAllTokens(); }

  // --- Centres ---
  async getCentre(centreId) { return this._getRepo().getCentre(centreId); }
  async getAllCentres() { return this._getRepo().getAllCentres(); }
  async saveCentre(centreData) { return this._getRepo().saveCentre(centreData); }

  // --- Counters ---
  async getCountersByCentre(centreId) { return this._getRepo().getCountersByCentre(centreId); }
  async getCounter(counterId) { return this._getRepo().getCounter(counterId); }
  async saveCounter(counterId, counterData) { return this._getRepo().saveCounter(counterId, counterData); }

  // --- Slots ---
  async getSlotsByCentre(centreId) { return this._getRepo().getSlotsByCentre(centreId); }
  async getSlot(slotId) { return this._getRepo().getSlot(slotId); }
  async saveSlot(slotId, slotData) { return this._getRepo().saveSlot(slotId, slotData); }

  // --- Users ---
  async getUserByEmail(email) { return this._getRepo().getUserByEmail(email); }
  async saveUser(userData) { return this._getRepo().saveUser(userData); }
  async getAllUsers() { return this._getRepo().getAllUsers(); }

  // --- Farmers ---
  async getFarmer(farmerId) { return this._getRepo().getFarmer(farmerId); }
  async saveFarmer(farmerData) { return this._getRepo().saveFarmer(farmerData); }

  // --- Notifications ---
  async getFarmerNotifications(farmerId) { return this._getRepo().getFarmerNotifications(farmerId); }
  async addNotification(farmerId, notification) { return this._getRepo().addNotification(farmerId, notification); }

  // --- Quality Inspections ---
  async saveQualityInspection(tokenNumber, record) { return this._getRepo().saveQualityInspection(tokenNumber, record); }

  // --- AI Recommendations ---
  async getRecommendation(id) { return this._getRepo().getRecommendation(id); }
  async getRecommendationsByCentre(centreId) { return this._getRepo().getRecommendationsByCentre(centreId); }
  async saveRecommendation(rec) { return this._getRepo().saveRecommendation(rec); }

  // --- Demo Variables ---
  async getDemoScenarioStep() { return this._getRepo().getDemoScenarioStep(); }
  async setDemoScenarioStep(step) { return this._getRepo().setDemoScenarioStep(step); }
  async getIsSimulatingCongestion() { return this._getRepo().getIsSimulatingCongestion(); }
  async setIsSimulatingCongestion(value) { return this._getRepo().setIsSimulatingCongestion(value); }
  async initSeedData() { return this._getRepo().initSeedData(); }
}

export const repository = new PersistenceManager();
