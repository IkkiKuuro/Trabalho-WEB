// MongoDB implementation of HumorDAO
import { HumorDAO } from '../HumorDAO';
import { Humor, TipoHumor } from '../../models/Humor';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import { getMongoDb } from './mongoConnection';
import logger from '../../utils/logger';

export class MongoHumorDAO implements HumorDAO {
  private collection: Collection;
  
  constructor() {
    this.collection = getMongoDb().collection('humores');
  }
  
  // Helper to convert MongoDB document to Humor model
  private docToHumor(doc: any): Humor | null {
    if (!doc) return null;
    
    return new Humor({
      id: doc._id.toString(),
      pacienteId: doc.pacienteId,
      dataRegistro: new Date(doc.dataRegistro),
      tipo: doc.tipo as TipoHumor,
      nivel: doc.nivel,
      notas: doc.notas
    });
  }
  
  // Base DAO methods
  async findById(id: string): Promise<Humor | null> {
    try {
      const doc = await this.collection.findOne({ _id: new ObjectId(id) });
      return this.docToHumor(doc);
    } catch (error) {
      logger.error(`Error finding humor by ID: ${error.message}`);
      return null;
    }
  }
  
  async findAll(): Promise<Humor[]> {
    try {
      const docs = await this.collection.find().toArray();
      return docs.map(doc => this.docToHumor(doc));
    } catch (error) {
      logger.error(`Error finding all humor records: ${error.message}`);
      return [];
    }
  }
  
  async create(humor: Humor): Promise<Humor> {
    try {
      const humorData = {
        pacienteId: humor.pacienteId,
        dataRegistro: humor.dataRegistro,
        tipo: humor.tipo,
        nivel: humor.nivel,
        notas: humor.notas
      };
      
      const result = await this.collection.insertOne(humorData);
      return this.findById(result.insertedId.toString());
    } catch (error) {
      logger.error(`Error creating humor record: ${error.message}`);
      throw error;
    }
  }
  
  async update(id: string, data: Partial<Humor>): Promise<Humor | null> {
    try {
      await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );
      
      return this.findById(id);
    } catch (error) {
      logger.error(`Error updating humor record: ${error.message}`);
      return null;
    }
  }
  
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      logger.error(`Error deleting humor record: ${error.message}`);
      return false;
    }
  }
  
  // HumorDAO specific methods
  async findByPacienteId(pacienteId: string): Promise<Humor[]> {
    try {
      const docs = await this.collection.find({ pacienteId }).toArray();
      return docs.map(doc => this.docToHumor(doc));
    } catch (error) {
      logger.error(`Error finding humor records by paciente ID: ${error.message}`);
      return [];
    }
  }
  
  async findByPacienteIdAndDateRange(
    pacienteId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<Humor[]> {
    try {
      const docs = await this.collection.find({
        pacienteId,
        dataRegistro: {
          $gte: startDate,
          $lte: endDate
        }
      }).toArray();
      
      return docs.map(doc => this.docToHumor(doc));
    } catch (error) {
      logger.error(`Error finding humor records by date range: ${error.message}`);
      return [];
    }
  }
  
  async getHumorStatsByPacienteId(pacienteId: string): Promise<any> {
    try {
      // Aggregation to get stats about patient's mood patterns
      const stats = await this.collection.aggregate([
        { $match: { pacienteId } },
        { 
          $group: {
            _id: "$tipo",
            count: { $sum: 1 },
            avgNivel: { $avg: "$nivel" }
          }
        },
        { $sort: { count: -1 } }
      ]).toArray();
      
      // Also get the trend over time
      const trendData = await this.collection.find(
        { pacienteId },
        { 
          sort: { dataRegistro: 1 },
          projection: { dataRegistro: 1, nivel: 1, tipo: 1, _id: 0 }
        }
      ).toArray();
      
      return {
        summary: stats,
        trend: trendData
      };
    } catch (error) {
      logger.error(`Error getting humor stats: ${error.message}`);
      return { summary: [], trend: [] };
    }
  }
}
