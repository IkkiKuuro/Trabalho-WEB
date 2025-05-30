import { User } from './User';

export interface Profissional extends User {
  id: string;
  crm: string;// Deve ser validado para garantir que é único
  especialidade: string;
}

export interface ProfissionalHashDeSenha extends Profissional {//issso e um metodo de seguransa da senha
  passwordHash: string;
}