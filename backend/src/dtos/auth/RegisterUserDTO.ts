// DTO para registro de usuário
import { UserRole } from '../../utils/constants';

export class RegisterUserDTO {
  nome: string;
  email: string;
  password: string;
  tipo: UserRole;
  // Campos específicos para pacientes
  dataNascimento?: Date;
  cpf?: string;
  contatoEmergencia?: string;
  // Campos específicos para profissionais
  crm?: string;
  especialidade?: string;

  constructor(data: {
    nome: string;
    email: string;
    password: string;
    tipo: UserRole;
    dataNascimento?: Date;
    cpf?: string;
    contatoEmergencia?: string;
    crm?: string;
    especialidade?: string;
  }) {
    this.nome = data.nome;
    this.email = data.email;
    this.password = data.password;
    this.tipo = data.tipo;
    
    // Campos específicos dependendo do tipo
    if (data.tipo === UserRole.PACIENTE) {
      this.dataNascimento = data.dataNascimento;
      this.cpf = data.cpf;
      this.contatoEmergencia = data.contatoEmergencia;
    } else if (data.tipo === UserRole.PROFISSIONAL) {
      this.crm = data.crm;
      this.especialidade = data.especialidade;
    }
  }

  // Método para validar os dados de registro
  validate(): string[] {
    const errors: string[] = [];

    if (!this.nome) errors.push('Nome é obrigatório');
    if (!this.email) errors.push('Email é obrigatório');
    if (!this.password) errors.push('Senha é obrigatória');
    if (this.password && this.password.length < 6) 
      errors.push('Senha deve ter pelo menos 6 caracteres');

    // Validações específicas para cada tipo de usuário
    if (this.tipo === UserRole.PACIENTE) {
      if (!this.dataNascimento) errors.push('Data de nascimento é obrigatória para pacientes');
      if (!this.cpf) errors.push('CPF é obrigatório para pacientes');
    } else if (this.tipo === UserRole.PROFISSIONAL) {
      if (!this.crm) errors.push('CRM é obrigatório para profissionais');
      if (!this.especialidade) errors.push('Especialidade é obrigatória para profissionais');
    }

    return errors;
  }
}
