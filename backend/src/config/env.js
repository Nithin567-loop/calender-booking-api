// Load and validate environment variables
require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/calendar_booking',
  jwt: {
    secret: process.env.JWT_SECRET || 'your_secret_key',
    expire: process.env.JWT_EXPIRE || '7d'
  }
};

// Validate required environment variables
if (!process.env.JWT_SECRET && config.nodeEnv === 'production') {
  console.error('FATAL ERROR: JWT_SECRET is not defined in production.');
  process.exit(1);
}

module.exports = config;