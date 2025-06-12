// DTO para resposta de usuário (após autenticação)
import { UserRole } from '../../utils/constants';

export class UserResponseDTO {
  id: string;
  nome: string;
  email: string;
  tipo: UserRole;
  token?: string;
  
  // Campos adicionais específicos para cada tipo
  dataNascimento?: Date;
  cpf?: string;
  crm?: string;
  especialidade?: string;

  constructor(data: {
    id: string;
    nome: string;
    email: string;
    tipo: UserRole;
    token?: string;
    dataNascimento?: Date;
    cpf?: string;
    crm?: string;
    especialidade?: string;
  }) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    this.tipo = data.tipo;
    this.token = data.token;
    
    // Adiciona campos específicos por tipo
    if (data.tipo === UserRole.PACIENTE) {
      this.dataNascimento = data.dataNascimento;
      this.cpf = data.cpf;
    } else if (data.tipo === UserRole.PROFISSIONAL) {
      this.crm = data.crm;
      this.especialidade = data.especialidade;
    }
  }
}
