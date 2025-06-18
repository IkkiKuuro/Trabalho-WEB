/**
 * DTO para login de usuário
 * Responsável por transportar os dados de login entre camadas
 */
export class LoginUserDTO {
  email: string;
  password: string;

  /**
   * @param data Dados de login
   */
  constructor(data: { email: string; password: string }) {
    this.email = data.email;
    this.password = data.password;
    
    // Validação básica
    this.validate();
  }
  
  /**
   * Valida os dados de login
   * @throws Error se os dados forem inválidos
   */
  private validate(): void {
    if (!this.email) {
      throw new Error('Email é obrigatório');
    }
    
    if (!this.password) {
      throw new Error('Senha é obrigatória');
    }
    
    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('Email inválido');
    }
  }
}
