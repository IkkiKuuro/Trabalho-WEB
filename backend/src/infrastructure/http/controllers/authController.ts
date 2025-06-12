// Authentication controller
import { Request, Response } from 'express';
import { IUserRepository } from '../../../core/ports/repositories/IUserRepository';
import { IAuthService } from '../../../core/ports/services/IAuthService';
import { MongoUserRepository } from '../../persistence/mongo/MongoUserRepository';
import { BcryptAuthService } from '../../services/implementations/BcryptAuthService';
import { AppError } from '../../../utils/AppError';
import logger from '../../../utils/logger';

export class AuthController {
  private userRepository: IUserRepository;
  private authService: IAuthService;
  
  constructor() {
    this.userRepository = new MongoUserRepository();
    this.authService = new BcryptAuthService();
  }
  
  /**
   * Login de usuário
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      // Verifica se o email existe
      const user = await this.userRepository.findByEmailWithPassword(email);
      
      if (!user) {
        throw new AppError('Email ou senha inválidos', 401);
      }
      
      // Verifica a senha
      const isPasswordValid = await this.authService.comparePassword(
        password, 
        user.password
      );
      
      if (!isPasswordValid) {
        throw new AppError('Email ou senha inválidos', 401);
      }
      
      // Gera o token JWT
      const token = this.authService.generateToken(user.id, user.tipo);
      
      // Retorna os dados do usuário e o token
      return res.json({
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo
        },
        token
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message
        });
      }
      
      logger.error(`Login error: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor'
      });
    }
  }
  
  /**
   * Registro de novo usuário
   */
  async register(req: Request, res: Response) {
    try {
      const { nome, email, password, tipo } = req.body;
      
      // Verifica se o email já está em uso
      const existingUser = await this.userRepository.findByEmail(email);
      
      if (existingUser) {
        throw new AppError('Email já está em uso', 400);
      }
      
      // Hash da senha
      const hashedPassword = await this.authService.hashPassword(password);
      
      // Cria o usuário
      const user = {
        nome,
        email,
        password: hashedPassword,
        tipo,
        dataCadastro: new Date(),
        dataAtualizacao: new Date()
      };
      
      const createdUser = await this.userRepository.save(user);
      
      // Gera o token JWT
      const token = this.authService.generateToken(createdUser.id, createdUser.tipo);
      
      // Retorna os dados do usuário e o token
      return res.status(201).json({
        user: {
          id: createdUser.id,
          nome: createdUser.nome,
          email: createdUser.email,
          tipo: createdUser.tipo
        },
        token
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message
        });
      }
      
      logger.error(`Register error: ${error.message}`);
      return res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor'
      });
    }
  }
}
