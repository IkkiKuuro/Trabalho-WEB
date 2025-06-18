import { User } from '../models/User';
import { BaseDAO } from './BaseDAO';

/**
 * Interface para acesso a dados de usuários
 * Estende BaseDAO e adiciona métodos específicos para usuários
 */
export interface UserDAO extends BaseDAO<User> {
  /**
   * Encontra um usuário pelo email
   * @param email Email do usuário
   * @returns Usuário encontrado ou null
   */
  findByEmail(email: string): Promise<User | null>;
  
  /**
   * Encontra um usuário pelo email incluindo a senha
   * Método específico para autenticação
   * @param email Email do usuário
   * @returns Usuário encontrado ou null
   */
  findByEmailWithPassword(email: string): Promise<User | null>;
}
