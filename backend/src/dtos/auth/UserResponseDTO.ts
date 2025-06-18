import { UserRole } from '../../utils/constants';

/**
 * DTO para resposta de usuário
 * Responsável por transportar os dados de resposta entre camadas
 */
export class UserResponseDTO {
  id: string;
  nome: string;
  email: string;
  tipo: UserRole;
  token?: string;
  profile?: any; // Pode ser tipado conforme necessário

  /**
   * @param data Dados do usuário
   */
  constructor(data: {
    id: string;
    nome: string;
    email: string;
    tipo: UserRole;
    token?: string;
    profile?: any;
  }) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    this.tipo = data.tipo;
    this.token = data.token;
    this.profile = data.profile;
  }
  
  /**
   * Transforma o DTO em um objeto JSON para resposta HTTP
   * @returns Objeto JSON limpo
   */
  toJSON() {
    // Remove campos undefined e null
    return Object.fromEntries(
      Object.entries(this).filter(([_, v]) => v != null)
    );
  }
}
