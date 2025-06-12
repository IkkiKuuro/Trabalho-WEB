// MongoDB implementation of TarefaDAO
import { TarefaDAO } from '../TarefaDAO';
import { Tarefa, TaskStatus } from '../../models/Tarefa';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import { getMongoDb } from './mongoConnection';
import logger from '../../utils/logger';

export class MongoTarefaDAO implements TarefaDAO {
  private collection: Collection;
  
  constructor() {
    this.collection = getMongoDb().collection('tarefas');
  }
  
  // Helper to convert MongoDB document to Tarefa model
  private docToTarefa(doc: any): Tarefa | null {
    if (!doc) return null;
    
    return new Tarefa({
      id: doc._id.toString(),
      pacienteId: doc.pacienteId,
      profissionalId: doc.profissionalId,
      descricao: doc.descricao,
      dataCriacao: new Date(doc.dataCriacao),
      dataLimite: new Date(doc.dataLimite),
      status: doc.status as TaskStatus,
      observacoesPaciente: doc.observacoesPaciente,
      concluida: doc.concluida
    });
  }
  
  // Base DAO methods
  async findById(id: string): Promise<Tarefa | null> {
    try {
      const doc = await this.collection.findOne({ _id: new ObjectId(id) });
      return this.docToTarefa(doc);
    } catch (error) {
      logger.error(`Error finding tarefa by ID: ${error.message}`);
      return null;
    }
  }
  
  async findAll(): Promise<Tarefa[]> {
    try {
      const docs = await this.collection.find().toArray();
      return docs.map(doc => this.docToTarefa(doc));
    } catch (error) {
      logger.error(`Error finding all tarefas: ${error.message}`);
      return [];
    }
  }
  
  async create(tarefa: Tarefa): Promise<Tarefa> {
    try {
      const tarefaData = {
        pacienteId: tarefa.pacienteId,
        profissionalId: tarefa.profissionalId,
        descricao: tarefa.descricao,
        dataCriacao: tarefa.dataCriacao,
        dataLimite: tarefa.dataLimite,
        status: tarefa.status,
        observacoesPaciente: tarefa.observacoesPaciente,
        concluida: tarefa.concluida
      };
      
      const result = await this.collection.insertOne(tarefaData);
      return this.findById(result.insertedId.toString());
    } catch (error) {
      logger.error(`Error creating tarefa: ${error.message}`);
      throw error;
    }
  }
  
  async update(id: string, data: Partial<Tarefa>): Promise<Tarefa | null> {
    try {
      await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );
      
      return this.findById(id);
    } catch (error) {
      logger.error(`Error updating tarefa: ${error.message}`);
      return null;
    }
  }
  
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      logger.error(`Error deleting tarefa: ${error.message}`);
      return false;
    }
  }
  
  // TarefaDAO specific methods
  async findByPacienteId(pacienteId: string): Promise<Tarefa[]> {
    try {
      const docs = await this.collection.find({ pacienteId }).toArray();
      return docs.map(doc => this.docToTarefa(doc));
    } catch (error) {
      logger.error(`Error finding tarefas by paciente ID: ${error.message}`);
      return [];
    }
  }
  
  async findByProfissionalId(profissionalId: string): Promise<Tarefa[]> {
    try {
      const docs = await this.collection.find({ profissionalId }).toArray();
      return docs.map(doc => this.docToTarefa(doc));
    } catch (error) {
      logger.error(`Error finding tarefas by profissional ID: ${error.message}`);
      return [];
    }
  }
  
  async findByStatus(status: TaskStatus): Promise<Tarefa[]> {
    try {
      const docs = await this.collection.find({ status }).toArray();
      return docs.map(doc => this.docToTarefa(doc));
    } catch (error) {
      logger.error(`Error finding tarefas by status: ${error.message}`);
      return [];
    }
  }
  
  async findByPacienteAndStatus(pacienteId: string, status: TaskStatus): Promise<Tarefa[]> {
    try {
      const docs = await this.collection.find({ pacienteId, status }).toArray();
      return docs.map(doc => this.docToTarefa(doc));
    } catch (error) {
      logger.error(`Error finding tarefas by paciente and status: ${error.message}`);
      return [];
    }
  }
  
  async updateStatus(id: string, status: TaskStatus): Promise<Tarefa | null> {
    try {
      await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            status,
            concluida: status === TaskStatus.CONCLUIDA 
          } 
        }
      );
      
      return this.findById(id);
    } catch (error) {
      logger.error(`Error updating tarefa status: ${error.message}`);
      return null;
    }
  }
  
  async checkOverdueTasks(): Promise<Tarefa[]> {
    try {
      const now = new Date();
      
      // Find all tasks that are past their deadline and not completed
      const docs = await this.collection.find({
        dataLimite: { $lt: now },
        status: { $ne: TaskStatus.CONCLUIDA },
        concluida: false
      }).toArray();
      
      // Update all overdue tasks to ATRASADA status
      if (docs.length > 0) {
        await this.collection.updateMany(
          {
            dataLimite: { $lt: now },
            status: { $ne: TaskStatus.CONCLUIDA },
            concluida: false
          },
          { $set: { status: TaskStatus.ATRASADA } }
        );
      }
      
      // Return the updated tasks
      return docs.map(doc => {
        // Create task with ATRASADA status for the response
        const task = this.docToTarefa(doc);
        task.status = TaskStatus.ATRASADA;
        return task;
      });
    } catch (error) {
      logger.error(`Error checking for overdue tasks: ${error.message}`);
      return [];
    }
  }
}
