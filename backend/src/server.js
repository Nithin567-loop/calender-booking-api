// ✅ FIX MongoDB Atlas SRV DNS issue (Windows + WARP + IPv6)
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const app = require('./app');
const connectDB = require('./config/database');
const config = require('./config/env');
const log = require('./utils/logger');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  log.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

// Connect to database
connectDB();

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
  log.info(`🚀 Server running in ${config.nodeEnv} mode on port ${PORT}`);
  log.info(`📡 API available at http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  log.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    log.info('Process terminated');
  });
});