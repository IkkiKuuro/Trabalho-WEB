// Root server entry point - Clean Architecture Implementation
import app from './infrastructure/http/server/app';
import { connectToMongo } from './infrastructure/persistence/mongo/mongoConnection';
import logger from './utils/logger';

const APP_PORT = process.env.PORT || 3000;

// Start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToMongo();
    
    // Start listening
    app.listen(APP_PORT, () => {
      logger.info(`Server running on port ${APP_PORT}`);
    });
  } catch (error: any) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
