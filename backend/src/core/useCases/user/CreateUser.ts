import { IUserRepository } from '../../ports/gateways/IUserRepository';
import { IAuthService } from '../../ports/gateways/IAuthService';
import { RegisterUserDTO } from '../../../shared/dtos/auth/RegisterUserDTO';
import { UserResponseDTO } from '../../../shared/dtos/auth/UserResponseDTO';
import { User } from '../../domain/User';

/**
 * Caso de uso: Criar usuário
 * Implementa a lógica de negócio para criar um novo usuário no sistema
 */
export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  /**
   * Executa o processo de criação de usuário
   */
  async execute(userData: RegisterUserDTO): Promise<UserResponseDTO> {
    // Verificar se já existe um usuário com o mesmo e-mail
    const existingUser = await this.userRepository.findByEmail(userData.email);
    
    if (existingUser) {
      throw new Error('E-mail já está em uso');
    }
    
    // Criar o hash da senha
    const passwordHash = await this.authService.hashPassword(userData.senha);
    
    // Criar um novo usuário no domínio
    const now = new Date();
    const newUser: User = {
      id: '', // Será gerado pelo banco de dados
      nome: userData.nome,
      email: userData.email,
      passwordHash,
      tipo: userData.tipo,
      dataCadastro: now,
      dataAtualizacao: now
    };
    
    // Salvar o usuário no repositório
    const savedUser = await this.userRepository.save(newUser);
    
    // Retornar os dados do usuário (sem informações sensíveis)
    return {
      id: savedUser.id,
      nome: savedUser.nome,
      email: savedUser.email,
      tipo: savedUser.tipo,
      dataCadastro: savedUser.dataCadastro
    };
  }
}