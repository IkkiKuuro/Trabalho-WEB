// MongoDB implementation of ConsultaDAO
import { ConsultaDAO } from '../ConsultaDAO';
import { Consulta, StatusConsulta } from '../../models/Consulta';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import { getMongoDb } from './mongoConnection';
import logger from '../../utils/logger';

export class MongoConsultaDAO implements ConsultaDAO {
  private collection: Collection;
  
  constructor() {
    this.collection = getMongoDb().collection('consultas');
  }
  
  // Helper to convert MongoDB document to Consulta model
  private docToConsulta(doc: any): Consulta | null {
    if (!doc) return null;
    
    return new Consulta({
      id: doc._id.toString(),
      pacienteId: doc.pacienteId,
      profissionalId: doc.profissionalId,
      dataHora: new Date(doc.dataHora),
      status: doc.status as StatusConsulta,
      observacoes: doc.observacoes,
      duracao: doc.duracao,
      modalidade: doc.modalidade
    });
  }
  
  // Base DAO methods
  async findById(id: string): Promise<Consulta | null> {
    try {
      const doc = await this.collection.findOne({ _id: new ObjectId(id) });
      return this.docToConsulta(doc);
    } catch (error) {
      logger.error(`Error finding consulta by ID: ${error.message}`);
      return null;
    }
  }
  
  async findAll(): Promise<Consulta[]> {
    try {
      const docs = await this.collection.find().toArray();
      return docs.map(doc => this.docToConsulta(doc));
    } catch (error) {
      logger.error(`Error finding all consultas: ${error.message}`);
      return [];
    }
  }
  
  async create(consulta: Consulta): Promise<Consulta> {
    try {
      const consultaData = {
        pacienteId: consulta.pacienteId,
        profissionalId: consulta.profissionalId,
        dataHora: consulta.dataHora,
        status: consulta.status,
        observacoes: consulta.observacoes,
        duracao: consulta.duracao,
        modalidade: consulta.modalidade
      };
      
      const result = await this.collection.insertOne(consultaData);
      return this.findById(result.insertedId.toString());
    } catch (error) {
      logger.error(`Error creating consulta: ${error.message}`);
      throw error;
    }
  }
  
  async update(id: string, data: Partial<Consulta>): Promise<Consulta | null> {
    try {
      await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );
      
      return this.findById(id);
    } catch (error) {
      logger.error(`Error updating consulta: ${error.message}`);
      return null;
    }
  }
  
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      logger.error(`Error deleting consulta: ${error.message}`);
      return false;
    }
  }
  
  // ConsultaDAO specific methods
  async findByPacienteId(pacienteId: string): Promise<Consulta[]> {
    try {
      const docs = await this.collection.find({ pacienteId }).toArray();
      return docs.map(doc => this.docToConsulta(doc));
    } catch (error) {
      logger.error(`Error finding consultas by paciente ID: ${error.message}`);
      return [];
    }
  }
  
  async findByProfissionalId(profissionalId: string): Promise<Consulta[]> {
    try {
      const docs = await this.collection.find({ profissionalId }).toArray();
      return docs.map(doc => this.docToConsulta(doc));
    } catch (error) {
      logger.error(`Error finding consultas by profissional ID: ${error.message}`);
      return [];
    }
  }
  
  async findByStatus(status: StatusConsulta): Promise<Consulta[]> {
    try {
      const docs = await this.collection.find({ status }).toArray();
      return docs.map(doc => this.docToConsulta(doc));
    } catch (error) {
      logger.error(`Error finding consultas by status: ${error.message}`);
      return [];
    }
  }
  
  async findByDateRange(startDate: Date, endDate: Date): Promise<Consulta[]> {
    try {
      const docs = await this.collection.find({
        dataHora: {
          $gte: startDate,
          $lte: endDate
        }
      }).toArray();
      
      return docs.map(doc => this.docToConsulta(doc));
    } catch (error) {
      logger.error(`Error finding consultas by date range: ${error.message}`);
      return [];
    }
  }
  
  async findUpcomingByPacienteId(pacienteId: string): Promise<Consulta[]> {
    try {
      const now = new Date();
      
      const docs = await this.collection.find({
        pacienteId,
        dataHora: { $gt: now },
        status: { $in: [StatusConsulta.AGENDADA, StatusConsulta.CONFIRMADA] }
      }).sort({ dataHora: 1 }).toArray();
      
      return docs.map(doc => this.docToConsulta(doc));
    } catch (error) {
      logger.error(`Error finding upcoming consultas for paciente: ${error.message}`);
      return [];
    }
  }
  
  async findUpcomingByProfissionalId(profissionalId: string): Promise<Consulta[]> {
    try {
      const now = new Date();
      
      const docs = await this.collection.find({
        profissionalId,
        dataHora: { $gt: now },
        status: { $in: [StatusConsulta.AGENDADA, StatusConsulta.CONFIRMADA] }
      }).sort({ dataHora: 1 }).toArray();
      
      return docs.map(doc => this.docToConsulta(doc));
    } catch (error) {
      logger.error(`Error finding upcoming consultas for profissional: ${error.message}`);
      return [];
    }
  }
  
  async updateStatus(id: string, status: StatusConsulta): Promise<Consulta | null> {
    try {
      await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );
      
      return this.findById(id);
    } catch (error) {
      logger.error(`Error updating consulta status: ${error.message}`);
      return null;
    }
  }
  
  async checkForAvailability(profissionalId: string, date: Date): Promise<boolean> {
    try {
      // Calculate a time window of +/- 1 hour around the requested time
      const startWindow = new Date(date);
      startWindow.setHours(date.getHours() - 1);
      
      const endWindow = new Date(date);
      endWindow.setHours(date.getHours() + 1);
      
      // Check if there are any existing appointments in that time window
      const existingAppointments = await this.collection.countDocuments({
        profissionalId,
        dataHora: {
          $gte: startWindow,
          $lte: endWindow
        },
        status: { $in: [StatusConsulta.AGENDADA, StatusConsulta.CONFIRMADA] }
      });
      
      // Return true if there are no existing appointments in that time window
      return existingAppointments === 0;
    } catch (error) {
      logger.error(`Error checking for availability: ${error.message}`);
      return false;
    }
  }
}
