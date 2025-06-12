// Modelo de usuário no padrão MVC
import { UserRole } from '../utils/constants';

export class User {
  id: string;
  nome: string;
  email: string;
  password: string;
  tipo: UserRole;
  dataCadastro: Date;
  dataAtualizacao: Date;

  constructor(data: {
    id?: string;
    nome: string;
    email: string;
    password: string;
    tipo: UserRole;
    dataCadastro?: Date;
    dataAtualizacao?: Date;
  }) {
    this.id = data.id || '';
    this.nome = data.nome;
    this.email = data.email;
    this.password = data.password;
    this.tipo = data.tipo;
    this.dataCadastro = data.dataCadastro || new Date();
    this.dataAtualizacao = data.dataAtualizacao || new Date();
  }

  // Método para converter o objeto em formato JSON (sem senha)
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      tipo: this.tipo,
      dataCadastro: this.dataCadastro,
      dataAtualizacao: this.dataAtualizacao
    };
  }
}
