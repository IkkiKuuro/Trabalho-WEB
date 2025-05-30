import { UserRole } from '../../types/common';

export interface UserResponseDTO {
  id: string;
  nome: string;
  email: string;
  tipo: UserRole;
  dataCadastro: Date;
}