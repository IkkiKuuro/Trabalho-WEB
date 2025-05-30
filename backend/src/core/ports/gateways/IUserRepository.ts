import { User } from '../../domain/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>; // Salva ou atualiza um usuário
  delete(id: string): Promise<void>;
  // ... outros métodos de acesso a dados. Eu n sei oq colocar aqui ainda
}