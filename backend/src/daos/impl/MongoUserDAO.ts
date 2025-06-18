import { UserDAO } from '../UserDAO';
import { User } from '../../models/User';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import { getMongoDb } from './mongoConnection';
import logger from '../../utils/logger';

/**
 * Implementação MongoDB do UserDAO
 * Realiza operações CRUD em usuários usando MongoDB
 */
export class MongoUserDAO implements UserDAO {
  private collection: Collection;
  
  /**
   * Inicializa o DAO com a conexão ao MongoDB
   */
  constructor() {
    this.collection = getMongoDb().collection('users');
  }
  
  /**
   * Converte um documento MongoDB para um modelo User
   * @param doc Documento MongoDB
   * @returns Instância de User ou null
   */
  private docToUser(doc: any): User | null {
    if (!doc) return null;
    
    return {
      id: doc._id.toString(),
      nome: doc.nome,
      email: doc.email,
      password: doc.password || '',
      tipo: doc.tipo,
      dataCadastro: new Date(doc.dataCadastro),
      dataAtualizacao: new Date(doc.dataAtualizacao)
    } as User;
  }
  
  /**
   * Converte um modelo User para documento MongoDB
   * @param user Instância de User
   * @returns Documento para MongoDB
   */
  private userToDoc(user: any): any {
    const doc: any = {
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      dataCadastro: user.dataCadastro,
      dataAtualizacao: new Date()
    };
    
    // Adiciona password apenas se fornecido
    if (user.password) {
      doc.password = user.password;
    }
    
    // Adiciona _id se o usuário já tem ID
    if (user.id) {
      try {
        doc._id = new ObjectId(user.id);
      } catch (error) {
        logger.error(`Invalid ObjectId: ${user.id}`);
      }
    }
    
    return doc;
  }
  
  /**
   * Encontra um usuário pelo ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      const doc = await this.collection.findOne({ _id: new ObjectId(id) });
      return this.docToUser(doc);
    } catch (error) {
      logger.error(`Error finding user by ID: ${error}`);
      return null;
    }
  }
  
  /**
   * Encontra todos os usuários
   */
  async findAll(): Promise<User[]> {
    try {
      const docs = await this.collection.find().toArray();
      return docs.map(doc => this.docToUser(doc)).filter(user => user !== null) as User[];
    } catch (error) {
      logger.error(`Error finding all users: ${error}`);
      return [];
    }
  }
  
  /**
   * Cria um novo usuário
   */
  async create(data: any): Promise<User> {
    try {
      const doc = this.userToDoc(data);
      const result = await this.collection.insertOne(doc);
      return this.docToUser({
        ...doc,
        _id: result.insertedId
      }) as User;
    } catch (error) {
      logger.error(`Error creating user: ${error}`);
      throw new Error(`Failed to create user: ${error}`);
    }
  }
  
  /**
   * Atualiza um usuário existente
   */
  async update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      const doc = this.userToDoc({
        ...data,
        id
      });
      
      // Remove _id do update
      const { _id, ...updateDoc } = doc;
      
      await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateDoc }
      );
      
      return this.findById(id);
    } catch (error) {
      logger.error(`Error updating user: ${error}`);
      return null;
    }
  }
  
  /**
   * Remove um usuário
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      logger.error(`Error deleting user: ${error}`);
      return false;
    }
  }
  
  /**
   * Encontra um usuário pelo email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const doc = await this.collection.findOne({ email });
      
      if (!doc) return null;
      
      // Não incluir a senha na resposta por segurança
      const user = this.docToUser(doc);
      if (user) {
        user.password = '';
      }
      
      return user;
    } catch (error) {
      logger.error(`Error finding user by email: ${error}`);
      return null;
    }
  }
  
  /**
   * Encontra um usuário pelo email incluindo a senha
   * Método específico para autenticação
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    try {
      const doc = await this.collection.findOne({ email });
      return this.docToUser(doc);
    } catch (error) {
      logger.error(`Error finding user by email with password: ${error}`);
      return null;
    }
  }
}
