import { Request, Response, NextFunction } from 'express';
import { AuthenticateUserUseCase } from '../../../core/useCases/user/AuthenticateUser';
import { CreateUserUseCase } from '../../../core/useCases/user/CreateUser';
import { PrismaUserRepository } from '../../database/prisma/PrismaUserRepository';
import { BcryptAuthService } from '../../services/implementations/BcryptAuthService';
import { HttpErrors } from '../../utils/AppError';
import logger from '../../utils/logger';

// Instanciando dependências
const userRepository = new PrismaUserRepository();
const authService = new BcryptAuthService();

/**
 * Controlador para gerenciar autenticação e registro de usuários
 */
export class AuthController {
  /**
   * Registra um novo usuário
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createUserUseCase = new CreateUserUseCase(userRepository, authService);
      const userData = req.body;
      
      const newUser = await createUserUseCase.execute(userData);
      
      logger.info(`Novo usuário registrado: ${newUser.email}`);
      res.status(201).json({ 
        success: true, 
        message: 'Usuário registrado com sucesso',
        data: newUser 
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Autentica um usuário e gera token JWT
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository, authService);
      const loginData = req.body;
      
      const { user, token } = await authenticateUserUseCase.execute(loginData);
      
      logger.info(`Usuário autenticado: ${user.email}`);
      res.status(200).json({
        success: true,
        message: 'Autenticação bem-sucedida',
        data: { user, token }
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'E-mail ou senha inválidos') {
        next(HttpErrors.unauthorized('E-mail ou senha inválidos'));
        return;
      }
      next(error);
    }
  }

  /**
   * Verifica se o token JWT é válido
   */
  async validateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // O middleware de autenticação já verificou o token
      // Se chegou aqui, o token é válido
      res.status(200).json({
        success: true,
        message: 'Token válido',
        data: { user: req.user }
      });
    } catch (error) {
      next(error);
    }
  }
}