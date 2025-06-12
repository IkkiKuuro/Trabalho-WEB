// Modelo de profissional no padrão MVC
import { User } from './User';
import { UserRole } from '../utils/constants';

export class Profissional extends User {
  crm: string;
  especialidade: string;
  biografia?: string;
  horariosDisponiveis?: string[];

  constructor(data: {
    id?: string;
    nome: string;
    email: string;
    password: string;
    crm: string;
    especialidade: string;
    biografia?: string;
    horariosDisponiveis?: string[];
    dataCadastro?: Date;
    dataAtualizacao?: Date;
  }) {
    super({
      id: data.id,
      nome: data.nome,
      email: data.email,
      password: data.password,
      tipo: UserRole.PROFISSIONAL,
      dataCadastro: data.dataCadastro,
      dataAtualizacao: data.dataAtualizacao
    });
    
    this.crm = data.crm;
    this.especialidade = data.especialidade;
    this.biografia = data.biografia;
    this.horariosDisponiveis = data.horariosDisponiveis;
  }

  // Sobrescreve o método toJSON para incluir as propriedades específicas
  toJSON() {
    return {
      ...super.toJSON(),
      crm: this.crm,
      especialidade: this.especialidade,
      biografia: this.biografia,
      horariosDisponiveis: this.horariosDisponiveis
    };
  }
}
