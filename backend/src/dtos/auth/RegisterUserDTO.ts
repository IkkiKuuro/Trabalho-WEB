import { UserRole } from '../../utils/constants';

/**
 * DTO para registro de novo usuário
 * Responsável por transportar os dados de registro entre camadas
 */
export class RegisterUserDTO {
  nome: string;
  email: string;
  password: string;
  tipo: UserRole;

  /**
   * @param data Dados de registro
   */
  constructor(data: { nome: string; email: string; password: string; tipo: UserRole }) {
    this.nome = data.nome;
    this.email = data.email;
    this.password = data.password;
    this.tipo = data.tipo;
    
    // Validação básica
    this.validate();
  }
  
  /**
   * Valida os dados de registro
   * @throws Error se os dados forem inválidos
   */
  private validate(): void {
    if (!this.nome) {
      throw new Error('Nome é obrigatório');
    }
    
    if (!this.email) {
      throw new Error('Email é obrigatório');
    }
    
    if (!this.password) {
      throw new Error('Senha é obrigatória');
    }
    
    if (!this.tipo) {
      throw new Error('Tipo de usuário é obrigatório');
    }
    
    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('Email inválido');
    }
    
    // Validação de senha
    if (this.password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }
    
    // Validação de tipo de usuário
    if (!Object.values(UserRole).includes(this.tipo)) {
      throw new Error('Tipo de usuário inválido');
    }
  }
}
