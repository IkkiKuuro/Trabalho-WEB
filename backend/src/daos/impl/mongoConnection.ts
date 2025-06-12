// MongoDB connection helper
import { MongoClient } from 'mongodb';
import logger from '../../utils/logger';
import { DATABASE_URL } from '../../utils/constants';

let db;
let client;

export async function connectToMongo() {
  try {
    client = new MongoClient(DATABASE_URL);
    await client.connect();
    
    db = client.db('saude-mental');
    logger.info('Connected to MongoDB successfully');
    
    return db;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}

export function getMongoDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToMongo first.');
  }
  return db;
}

export function closeMongoConnection() {
  if (client) {
    client.close();
    logger.info('MongoDB connection closed');
  }
}
