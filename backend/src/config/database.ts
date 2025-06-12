// Database configuration
import dotenv from 'dotenv';
import { connectToMongo, closeMongoConnection } from '../daos/impl/mongoConnection';
import logger from '../utils/logger';

// Load environment variables
dotenv.config();

// Database configuration options
const dbConfig = {
  // MongoDB connection string from environment variable or fallback to default
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/saude-mental',
  
  // Database name
  dbName: process.env.DB_NAME || 'saude-mental',
  
  // Connection options
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000, // 10 seconds
    socketTimeoutMS: 45000,  // 45 seconds
    serverSelectionTimeoutMS: 5000, // 5 seconds
  }
};

// Initialize the database connection
export const initializeDatabase = async () => {
  try {
    logger.info('Initializing database connection...');
    
    // Set the connection string from config
    process.env.DATABASE_URL = dbConfig.mongoUri;
    
    // Connect to MongoDB
    const db = await connectToMongo();
    
    logger.info('Database connected successfully');
    return db;
  } catch (error) {
    logger.error(`Database initialization error: ${error.message}`);
    throw error;
  }
};

// Close the database connection
export const closeDatabase = async () => {
  try {
    await closeMongoConnection();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error(`Error closing database: ${error.message}`);
  }
};

export default dbConfig;
