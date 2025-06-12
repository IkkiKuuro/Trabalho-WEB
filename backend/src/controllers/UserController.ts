// User controller for user profile management
import { Request, Response } from 'express';
import { MongoUserDAO } from '../daos/impl/MongoUserDAO';
import { AppError, NotFoundError } from '../utils/AppError';
import logger from '../utils/logger';
import { UserRole } from '../utils/constants';

export class UserController {
  private userDAO: MongoUserDAO;
  
  constructor() {
    this.userDAO = new MongoUserDAO();
  }
  
  /**
   * Obtém detalhes do perfil do usuário
   */
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user.userId; // Set by authMiddleware
      
      // Busca o usuário com base no tipo
      let user;
      
      if (req.user.userRole === UserRole.PACIENTE) {
        user = await this.userDAO.findPacienteById(userId);
      } else if (req.user.userRole === UserRole.PROFISSIONAL) {
        user = await this.userDAO.findProfissionalById(userId);
      } else {
        user = await this.userDAO.findById(userId);
      }
      
      if (!user) {
        throw NotFoundError('Usuário');
      }
      
      return res.status(200).json(user.toJSON());
    } catch (error) {
      logger.error(`Get profile error: ${error.message}`);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
  
  /**
   * Atualiza o perfil do usuário
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user.userId; // Set by authMiddleware
      const updateData = req.body;
      
      // Remova campos que não devem ser atualizados diretamente
      const { password, email, tipo, id, ...safeUpdateData } = updateData;
      
      // Verifica se o usuário existe
      const existingUser = await this.userDAO.findById(userId);
      
      if (!existingUser) {
        throw NotFoundError('Usuário');
      }
      
      // Atualiza o perfil
      const updatedUser = await this.userDAO.update(userId, safeUpdateData);
      
      return res.status(200).json(updatedUser.toJSON());
    } catch (error) {
      logger.error(`Update profile error: ${error.message}`);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
  
  /**
   * Atualiza a senha do usuário
   */
  async updatePassword(req: Request, res: Response) {
    try {
      const userId = req.user.userId; // Set by authMiddleware
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        throw new AppError('Senha atual e nova senha são obrigatórias', 400);
      }
      
      if (newPassword.length < 6) {
        throw new AppError('A nova senha deve ter pelo menos 6 caracteres', 400);
      }
      
      // Busca o usuário com a senha atual
      const user = await this.userDAO.findById(userId);
      
      if (!user) {
        throw NotFoundError('Usuário');
      }
      
      // Verifica a senha atual
      const authService = new BcryptJwtAuthService();
      const isPasswordValid = await authService.comparePassword(
        currentPassword, 
        user.password
      );
      
      if (!isPasswordValid) {
        throw new AppError('Senha atual incorreta', 400);
      }
      
      // Atualiza a senha
      const success = await this.userDAO.updatePassword(userId, newPassword);
      
      if (!success) {
        throw new AppError('Não foi possível atualizar a senha', 500);
      }
      
      return res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      logger.error(`Update password error: ${error.message}`);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
  
  /**
   * Lista todos os usuários (apenas para admin)
   */
  async listUsers(req: Request, res: Response) {
    try {
      // Verifica se é um admin
      if (req.user.userRole !== UserRole.ADMIN) {
        throw new AppError('Acesso negado', 403);
      }
      
      const users = await this.userDAO.findAll();
      
      // Remove sensitive information
      const safeUsers = users.map(user => user.toJSON());
      
      return res.status(200).json(safeUsers);
    } catch (error) {
      logger.error(`List users error: ${error.message}`);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}
