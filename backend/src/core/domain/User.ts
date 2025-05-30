import { UserRole } from '../../shared/types/common';

export interface User {
  id: string;
  nome: string;
  email: string;
  passwordHash: string; // Armazenar o hash da senha
  tipo: UserRole;
  dataCadastro: Date;
  dataAtualizacao: Date;
}