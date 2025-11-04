import config from './config/env.js'; // Loads and validates environment variables
import app from './app.js';
import connectDB from './config/db.js';

// Connect to MongoDB
connectDB();

// Start server
const server = app.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║        🚀 MHM Backend API Server Started               ║
║                                                        ║
║        Environment: ${config.nodeEnv}                           ║
║        Port: ${config.port}                                      ║
║        URL: http://localhost:${config.port}                       ║
║                                                        ║
║        📚 API Documentation:                           ║
║        http://localhost:${config.port}/api-docs                   ║
║                                                        ║
║        Endpoints:                                      ║
║        • GET  /health                                  ║
║        • POST /api/users/register                      ║
║        • POST /api/users/login                         ║
║        • GET  /api/users/me (protected)                ║
║        • PUT  /api/users/me (protected)                ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  console.error(err.stack);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM signal (graceful shutdown)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});
