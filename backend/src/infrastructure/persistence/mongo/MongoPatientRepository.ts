import { Paciente } from '../../../core/domain/Paciente';
import { IPatientRepository } from '../../../core/ports/repositories/IPatientRepository';
import { Collection, ObjectId } from 'mongodb';
import { getMongoDb } from './mongoConnection';

export class MongoPatientRepository implements IPatientRepository {
  private collection: Collection;
  
  constructor() {
    this.collection = getMongoDb().collection('pacientes');
  }
  
  private docToPaciente(doc: any): Paciente | null {
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
  
  async findById(id: string): Promise<Paciente | null> {
    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    return this.docToPaciente(doc);
  }
  
  async findByUserId(userId: string): Promise<Paciente | null> {
    const doc = await this.collection.findOne({ userId: userId });
    return this.docToPaciente(doc);
  }
  
  async save(paciente: Paciente): Promise<Paciente> {
    // Implementação do método save
    if (paciente.id) {
      // Atualizar paciente existente
      await this.collection.updateOne(
        { _id: new ObjectId(paciente.id) },
        { $set: paciente }
      );
      return paciente;
    } else {
      // Criar novo paciente
      const result = await this.collection.insertOne({
        ...paciente,
        _id: new ObjectId()
      });
      
      return {
        ...paciente,
        id: result.insertedId.toString()
      } as Paciente;
    }
  }
  
  async update(paciente: Paciente): Promise<Paciente> {
    await this.collection.updateOne(
      { _id: new ObjectId(paciente.id) },
      { $set: paciente }
    );
    return paciente;
  }
  
  async delete(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
  
  async listAll(): Promise<Paciente[]> {
    const docs = await this.collection.find().toArray();
    return docs.map(doc => this.docToPaciente(doc)).filter(Boolean) as Paciente[];
  }
  
  async registerMood(pacienteId: string, humor: any): Promise<any> {
    // Implementação do método registerMood
    const result = await getMongoDb().collection('humores').insertOne({
      pacienteId,
      ...humor,
      dataCriacao: new Date()
    });
    
    return {
      id: result.insertedId.toString(),
      pacienteId,
      ...humor,
      dataCriacao: new Date()
    };
  }
  
  async getMoodHistory(pacienteId: string): Promise<any[]> {
    // Implementação do método getMoodHistory
    const docs = await getMongoDb().collection('humores')
      .find({ pacienteId })
      .sort({ dataCriacao: -1 }) // Ordenar do mais recente para o mais antigo
      .toArray();
      
    return docs.map(doc => ({
      id: doc._id.toString(),
      ...doc,
      _id: undefined
    }));
  }
}
