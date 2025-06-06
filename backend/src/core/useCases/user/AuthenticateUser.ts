import { IUserRepository } from '../../ports/gateways/IUserRepository';
import { IAuthService } from '../../ports/gateways/IAuthService';
import { LoginUserDTO } from '../../../shared/dtos/auth/LoginUserDTO';
import { UserResponseDTO } from '../../../shared/dtos/auth/UserResponseDTO';

/**
 * Estrutura da resposta do caso de uso de autenticação
 */
interface AuthenticationResponse {
  user: UserResponseDTO;
  token: string;
}

/**
 * Caso de uso: Autenticar usuário
 * Implementa a lógica de negócio para autenticar um usuário no sistema
 */
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  /**
   * Executa o processo de autenticação
   */
  async execute(loginData: LoginUserDTO): Promise<AuthenticationResponse> {
    // Buscar o usuário pelo e-mail
    const user = await this.userRepository.findByEmail(loginData.email);
    
    // Verificar se o usuário existe
    if (!user) {
      throw new Error('E-mail ou senha inválidos');
    }
    
    // Verificar se a senha está correta
    const passwordMatches = await this.authService.comparePassword(
      loginData.senha, 
      user.passwordHash
    );
    
    if (!passwordMatches) {
      throw new Error('E-mail ou senha inválidos');
    }
    
    // Gerar o token JWT
    const token = this.authService.generateToken(user.id, user.tipo);
    
    // Retornar os dados do usuário (sem informações sensíveis) e o token
    return {
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        dataCadastro: user.dataCadastro
      },
      token
    };
  }
}