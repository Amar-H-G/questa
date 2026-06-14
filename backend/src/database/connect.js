const mongoose = require('mongoose');
const dns = require('dns');
const env = require('../config/env');

// Fix DNS resolution issues for MongoDB SRV records on Windows/local networks
if (env.MONGO_URI && env.MONGO_URI.startsWith('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    console.warn('Warning: Could not set custom DNS servers for SRV resolution:', err.message);
  }
}

const connectDatabase = async () => {
  mongoose.set('strictQuery', true);

  const connection = await mongoose.connect(env.MONGO_URI, {
    autoIndex: env.NODE_ENV !== 'production',
  });

  console.log(`MongoDB connected: ${connection.connection.host}`);

  // Programmatically drop legacy index if it exists to avoid registration duplicate key errors
  try {
    const db = connection.connection.db;
    const collections = await db.listCollections({ name: 'users' }).toArray();
    if (collections.length > 0) {
      const usersCollection = db.collection('users');
      const indexes = await usersCollection.indexes();
      const hasSupabaseIndex = indexes.some(idx => idx.name === 'supabaseUserId_1');
      if (hasSupabaseIndex) {
        await usersCollection.dropIndex('supabaseUserId_1');
        console.log('Legacy unique index "supabaseUserId_1" dropped successfully.');
      }
    }
  } catch (err) {
    console.warn('Could not check or drop legacy indexes:', err.message);
  }

  return connection;
};

module.exports = connectDatabase;
