// Modelo de paciente no padrão MVC
import { User } from './User';
import { UserRole } from '../utils/constants';

export class Paciente extends User {
  dataNascimento: Date;
  cpf: string;
  contatoEmergencia?: string;
  historico?: string;

  constructor(data: {
    id?: string;
    nome: string;
    email: string;
    password: string;
    dataNascimento: Date;
    cpf: string;
    contatoEmergencia?: string;
    historico?: string;
    dataCadastro?: Date;
    dataAtualizacao?: Date;
  }) {
    super({
      id: data.id,
      nome: data.nome,
      email: data.email,
      password: data.password,
      tipo: UserRole.PACIENTE,
      dataCadastro: data.dataCadastro,
      dataAtualizacao: data.dataAtualizacao
    });
    
    this.dataNascimento = data.dataNascimento;
    this.cpf = data.cpf;
    this.contatoEmergencia = data.contatoEmergencia;
    this.historico = data.historico;
  }

  // Sobrescreve o método toJSON para incluir as propriedades específicas de Paciente
  toJSON() {
    return {
      ...super.toJSON(),
      dataNascimento: this.dataNascimento,
      cpf: this.cpf,
      contatoEmergencia: this.contatoEmergencia,
      historico: this.historico,
    };
  }
}
