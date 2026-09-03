import mongoose from 'mongoose';

export const dbConfig = {
  mode: 'memory' // 'memory' or 'mongodb'
};

export const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('MongoDB URI missing. Running in MEMORY mode.');
    dbConfig.mode = 'memory';
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB. Running in MONGODB mode.');
    dbConfig.mode = 'mongodb';
  } catch (err) {
    console.warn(`⚠️ MongoDB connection failed: ${err.message}. Falling back to MEMORY mode.`);
    dbConfig.mode = 'memory';
  }
};

export const disconnectMongoDB = async () => {
  if (dbConfig.mode === 'mongodb') {
    await mongoose.disconnect();
    dbConfig.mode = 'memory';
  }
};

export const getDatabaseStatus = () => {
  return { persistence: dbConfig.mode };
};
