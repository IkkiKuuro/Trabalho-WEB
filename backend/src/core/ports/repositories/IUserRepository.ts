import { User } from '../../domain/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByEmailWithPassword(email: string): Promise<User | null>; // Método específico para autenticação
  save(user: User): Promise<User>; // Salva ou atualiza um usuário
  delete(id: string): Promise<void>;
}
