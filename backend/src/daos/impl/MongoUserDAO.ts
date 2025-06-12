// MongoDB implementation of UserDAO
import { UserDAO } from '../../daos/UserDAO';
import { User } from '../../models/User';
import { Paciente } from '../../models/Paciente';
import { Profissional } from '../../models/Profissional';
import { UserRole } from '../../utils/constants';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import { getMongoDb } from './mongoConnection';
import bcrypt from 'bcrypt';
import logger from '../../utils/logger';

export class MongoUserDAO implements UserDAO {
  private collection: Collection;
  
  constructor() {
    this.collection = getMongoDb().collection('users');
  }
  
  // Helper to convert MongoDB document to User model
  private docToUser(doc: any): User {
    if (!doc) return null;
    
    const userData = {
      id: doc._id.toString(),
      nome: doc.nome,
      email: doc.email,
      password: doc.password,
      tipo: doc.tipo,
      dataCadastro: new Date(doc.dataCadastro),
      dataAtualizacao: new Date(doc.dataAtualizacao)
    };
    
    return new User(userData);
  }
  
  // Helper to convert MongoDB document to Paciente model
  private docToPaciente(doc: any): Paciente {
    if (!doc) return null;
    
    return new Paciente({
      id: doc._id.toString(),
      nome: doc.nome,
      email: doc.email,
      password: doc.password,
      dataNascimento: new Date(doc.dataNascimento),
      cpf: doc.cpf,
      contatoEmergencia: doc.contatoEmergencia,
      historico: doc.historico,
      dataCadastro: new Date(doc.dataCadastro),
      dataAtualizacao: new Date(doc.dataAtualizacao)
    });
  }
  
  // Helper to convert MongoDB document to Profissional model
  private docToProfissional(doc: any): Profissional {
    if (!doc) return null;
    
    return new Profissional({
      id: doc._id.toString(),
      nome: doc.nome,
      email: doc.email,
      password: doc.password,
      crm: doc.crm,
      especialidade: doc.especialidade,
      biografia: doc.biografia,
      horariosDisponiveis: doc.horariosDisponiveis,
      dataCadastro: new Date(doc.dataCadastro),
      dataAtualizacao: new Date(doc.dataAtualizacao)
    });
  }
  
  // Base DAO methods
  async findById(id: string): Promise<User | null> {
    try {
      const doc = await this.collection.findOne({ _id: new ObjectId(id) });
      return this.docToUser(doc);
    } catch (error) {
      logger.error(`Error finding user by ID: ${error.message}`);
      return null;
    }
  }
  
  async findAll(): Promise<User[]> {
    try {
      const docs = await this.collection.find().toArray();
      return docs.map(doc => this.docToUser(doc));
    } catch (error) {
      logger.error(`Error finding all users: ${error.message}`);
      return [];
    }
  }
  
  async create(user: User): Promise<User> {
    try {
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      const userData = {
        nome: user.nome,
        email: user.email,
        password: hashedPassword,
        tipo: user.tipo,
        dataCadastro: new Date(),
        dataAtualizacao: new Date()
      };
      
      const result = await this.collection.insertOne(userData);
      return this.findById(result.insertedId.toString());
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }
  
  async update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      // Don't allow updating password through this method
      const { password, ...updateData } = data;
      
      updateData.dataAtualizacao = new Date();
      
      await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      
      return this.findById(id);
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      return null;
    }
  }
  
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      logger.error(`Error deleting user: ${error.message}`);
      return false;
    }
  }
  
  // UserDAO specific methods
  async findByEmail(email: string): Promise<User | null> {
    try {
      const doc = await this.collection.findOne({ email });
      return this.docToUser(doc);
    } catch (error) {
      logger.error(`Error finding user by email: ${error.message}`);
      return null;
    }
  }
  
  async findByEmailWithPassword(email: string): Promise<User | null> {
    // Same as findByEmail in this implementation, since we store the password
    return this.findByEmail(email);
  }
  
  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const result = await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            password: hashedPassword,
            dataAtualizacao: new Date()
          } 
        }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      logger.error(`Error updating password: ${error.message}`);
      return false;
    }
  }
  
  // Paciente specific methods
  async createPaciente(paciente: Paciente): Promise<Paciente> {
    try {
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(paciente.password, 10);
      
      const pacienteData = {
        nome: paciente.nome,
        email: paciente.email,
        password: hashedPassword,
        tipo: UserRole.PACIENTE,
        dataNascimento: paciente.dataNascimento,
        cpf: paciente.cpf,
        contatoEmergencia: paciente.contatoEmergencia,
        historico: paciente.historico,
        dataCadastro: new Date(),
        dataAtualizacao: new Date()
      };
      
      const result = await this.collection.insertOne(pacienteData);
      const doc = await this.collection.findOne({ _id: result.insertedId });
      return this.docToPaciente(doc);
    } catch (error) {
      logger.error(`Error creating paciente: ${error.message}`);
      throw error;
    }
  }
  
  async findPacienteById(id: string): Promise<Paciente | null> {
    try {
      const doc = await this.collection.findOne({ 
        _id: new ObjectId(id),
        tipo: UserRole.PACIENTE 
      });
      
      return this.docToPaciente(doc);
    } catch (error) {
      logger.error(`Error finding paciente by ID: ${error.message}`);
      return null;
    }
  }
  
  // Profissional specific methods
  async createProfissional(profissional: Profissional): Promise<Profissional> {
    try {
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(profissional.password, 10);
      
      const profissionalData = {
        nome: profissional.nome,
        email: profissional.email,
        password: hashedPassword,
        tipo: UserRole.PROFISSIONAL,
        crm: profissional.crm,
        especialidade: profissional.especialidade,
        biografia: profissional.biografia,
        horariosDisponiveis: profissional.horariosDisponiveis,
        dataCadastro: new Date(),
        dataAtualizacao: new Date()
      };
      
      const result = await this.collection.insertOne(profissionalData);
      const doc = await this.collection.findOne({ _id: result.insertedId });
      return this.docToProfissional(doc);
    } catch (error) {
      logger.error(`Error creating profissional: ${error.message}`);
      throw error;
    }
  }
  
  async findProfissionalById(id: string): Promise<Profissional | null> {
    try {
      const doc = await this.collection.findOne({ 
        _id: new ObjectId(id),
        tipo: UserRole.PROFISSIONAL 
      });
      
      return this.docToProfissional(doc);
    } catch (error) {
      logger.error(`Error finding profissional by ID: ${error.message}`);
      return null;
    }
  }
  
  async findProfissionalByCRM(crm: string): Promise<Profissional | null> {
    try {
      const doc = await this.collection.findOne({ 
        crm,
        tipo: UserRole.PROFISSIONAL 
      });
      
      return this.docToProfissional(doc);
    } catch (error) {
      logger.error(`Error finding profissional by CRM: ${error.message}`);
      return null;
    }
  }
  
  // Role-based query
  async findUsersByRole(role: UserRole): Promise<User[]> {
    try {
      const docs = await this.collection.find({ tipo: role }).toArray();
      
      if (role === UserRole.PACIENTE) {
        return docs.map(doc => this.docToPaciente(doc));
      } else if (role === UserRole.PROFISSIONAL) {
        return docs.map(doc => this.docToProfissional(doc));
      } else {
        return docs.map(doc => this.docToUser(doc));
      }
    } catch (error) {
      logger.error(`Error finding users by role: ${error.message}`);
      return [];
    }
  }
}
