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
  return connection;
};

module.exports = connectDatabase;
