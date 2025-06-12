// MongoDB UserRepository implementation
import { IUserRepository } from '../../../core/ports/repositories/IUserRepository';
import { User } from '../../../core/domain/User';
import { Collection, ObjectId } from 'mongodb';
import { getMongoDb } from './mongoConnection';

export class MongoUserRepository implements IUserRepository {
  private collection: Collection;
  
  constructor() {
    this.collection = getMongoDb().collection('users');
  }
  
  // Helper to convert MongoDB document to User model
  private docToUser(doc: any): User | null {
    if (!doc) return null;
    
    return new User({
      id: doc._id.toString(),
      nome: doc.nome,
      email: doc.email,
      password: doc.password,
      tipo: doc.tipo,
      dataCadastro: new Date(doc.dataCadastro),
      dataAtualizacao: new Date(doc.dataAtualizacao)
    });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.collection.findOne({ email });
    return this.docToUser(doc);
  }
  
  async findById(id: string): Promise<User | null> {
    try {
      const doc = await this.collection.findOne({ _id: new ObjectId(id) });
      return this.docToUser(doc);
    } catch (error) {
      return null;
    }
  }
  
  async findByEmailWithPassword(email: string): Promise<User | null> {
    const doc = await this.collection.findOne({ email });
    return this.docToUser(doc);
  }
  
  async save(user: User): Promise<User> {
    const userData = {
      nome: user.nome,
      email: user.email,
      password: user.password,
      tipo: user.tipo,
      dataCadastro: user.dataCadastro,
      dataAtualizacao: new Date()
    };
    
    if (user.id) {
      // Atualizar usuário existente
      await this.collection.updateOne(
        { _id: new ObjectId(user.id) },
        { $set: userData }
      );
      return user;
    } else {
      // Criar novo usuário
      userData.dataCadastro = new Date();
      const result = await this.collection.insertOne({
        ...userData,
        _id: new ObjectId()
      });
      
      return new User({
        ...userData,
        id: result.insertedId.toString()
      });
    }
  }
  
  async delete(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}
