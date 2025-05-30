import { UserRole } from '../../types/common';

export interface RegisterUserDTO {
  nome: string;
  email: string;
  senha: string; // Senha em texto claro (antes do hash)
  tipo: UserRole;
  // Opcional: Adicione campos específicos de Paciente/Profissional se quiser no mesmo DTO inicial
  cpf?: string;
  dataNascimento?: Date;
  contatoEmergencia?: any; // Pode ser mais específico se tiver um tipo JSON
  crm?: string;
  especialidade?: string;
}