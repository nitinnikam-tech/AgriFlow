import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { mongoRepository } from '../repositories/mongoRepository.js';
import { dbConfig, connectMongoDB, disconnectMongoDB } from '../config/database.js';

dotenv.config();

const runSeed = async () => {
  console.log('🌱 Starting AgriFlow Database Seeder...');
  
  await connectMongoDB();
  
  if (dbConfig.mode !== 'mongodb') {
    console.error('❌ Cannot seed MongoDB: MongoDB connection failed or URI missing.');
    process.exit(1);
  }

  try {
    console.log('🔄 Initializing in-memory demo data and syncing to MongoDB...');
    await mongoRepository.initSeedData();
    console.log('✅ MongoDB Seeding Completed Successfully! All collections are synchronized.');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await disconnectMongoDB();
    console.log('👋 Seeder finished.');
    process.exit(0);
  }
};

runSeed();
