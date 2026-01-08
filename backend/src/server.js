const app = require('./app');
const config = require('./config');
const pool = require('./config/database');

const PORT = config.app.port;

// Graceful shutdown handler
const gracefulShutdown = async () => {
  console.log('\n Shutting down gracefully...');
  
  try {
    await pool.end();
    console.log(' Database connections closed');
    process.exit(0);
  } catch (err) {
    console.error(' Error during shutdown:', err);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   CloudTask API Server                ║
  ║   Environment: ${config.app.env.padEnd(23)}║
  ║   Port: ${PORT.toString().padEnd(30)}║
  ║   Health: http://localhost:${PORT}/health  ║
  ╚═══════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});