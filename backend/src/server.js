import dotenv from 'dotenv';
import app from './app.js';
import prisma from './utils/prisma.js';

// Setup environment configuration
dotenv.config();

const PORT = process.env.PORT || 5000;

// Verify Database connectivity check on startup
async function startServer() {
  try {
    // Basic query to check connection
    await prisma.$connect();
    console.log('🔌 Database connected successfully via Prisma Client.');
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    });

    // Graceful error exits
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received. Shutting down server gracefully.');
      server.close(() => {
        console.log('💥 Process terminated!');
      });
    });

  } catch (error) {
    console.error('❌ Failed to establish database connection or boot server:', error);
    process.exit(1);
  }
}

// Uncaught Exceptions protection
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

startServer();
