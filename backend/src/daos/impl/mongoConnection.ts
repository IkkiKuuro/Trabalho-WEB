import { MongoClient, Db } from 'mongodb';
import logger from '../../utils/logger';

// Variáveis para armazenar a conexão
let client: MongoClient;
let db: Db;

// URL de conexão com o MongoDB (pode vir de variável de ambiente)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/saude_mental';
const DB_NAME = process.env.DB_NAME || 'saude_mental';

/**
 * Inicializa a conexão com o MongoDB
 * @returns Instância do banco de dados MongoDB
 */
export async function initMongoDB(): Promise<Db> {
  try {
    // Se já existe uma conexão, retorna
    if (db) {
      return db;
    }
    
    // Conecta ao MongoDB
    client = new MongoClient(MONGO_URI);
    await client.connect();
    
    // Obtém referência ao banco de dados
    db = client.db(DB_NAME);
    
    logger.info('Conectado ao MongoDB com sucesso');
    return db;
  } catch (error) {
    logger.error(`Erro ao conectar ao MongoDB: ${error}`);
    throw new Error('Falha ao conectar ao MongoDB');
  }
}

/**
 * Obtém a instância do banco de dados MongoDB
 * @returns Instância do banco de dados MongoDB
 */
export function getMongoDb(): Db {
  if (!db) {
    throw new Error('MongoDB não foi inicializado. Chame initMongoDB primeiro.');
  }
  return db;
}

/**
 * Fecha a conexão com o MongoDB
 */
export async function closeMongoDB(): Promise<void> {
  if (client) {
    await client.close();
    logger.info('Conexão com MongoDB fechada');
  }
}
