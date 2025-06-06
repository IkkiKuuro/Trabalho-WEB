import { Request, Response, NextFunction } from 'express';
import { PrismaUserRepository } from '../../database/prisma/PrismaUserRepository';
import { HttpErrors } from '../../utils/AppError';
import logger from '../../utils/logger';

// Instanciando dependências
const userRepository = new PrismaUserRepository();

/**
 * Controlador para gerenciar operações de usuários
 */
export class UserController {
  /**
   * Busca um usuário pelo ID
   */
  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const user = await userRepository.findById(id);
      
      if (!user) {
        throw HttpErrors.notFound('Usuário não encontrado');
      }
      
      // Removendo dados sensíveis antes de enviar
      const { passwordHash, ...userWithoutPassword } = user;
      
      res.status(200).json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza dados do usuário
   */
  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userData = req.body;
      
      // Verificar se o usuário existe
      const existingUser = await userRepository.findById(id);
      
      if (!existingUser) {
        throw HttpErrors.notFound('Usuário não encontrado');
      }
      
      // Verificar se o usuário logado tem permissão para editar
      const loggedUserId = (req.user as any).userId;
      if (loggedUserId !== id) {
        throw HttpErrors.forbidden('Você não tem permissão para editar este usuário');
      }
      
      // Atualizar apenas os campos permitidos
      const updatedUser = {
        ...existingUser,
        nome: userData.nome || existingUser.nome,
        email: userData.email || existingUser.email,
        dataAtualizacao: new Date()
      };
      
      const result = await userRepository.save(updatedUser);
      
      // Removendo dados sensíveis antes de enviar
      const { passwordHash, ...userWithoutPassword } = result;
      
      logger.info(`Usuário atualizado: ${id}`);
      res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: userWithoutPassword
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Exclui um usuário
   */
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      // Verificar se o usuário existe
      const existingUser = await userRepository.findById(id);
      
      if (!existingUser) {
        throw HttpErrors.notFound('Usuário não encontrado');
      }
      
      // Verificar se o usuário logado tem permissão para excluir
      const loggedUserId = (req.user as any).userId;
      const loggedUserRole = (req.user as any).userRole;
      
      if (loggedUserId !== id && loggedUserRole !== 'ADMIN') {
        throw HttpErrors.forbidden('Você não tem permissão para excluir este usuário');
      }
      
      await userRepository.delete(id);
      
      logger.info(`Usuário excluído: ${id}`);
      res.status(200).json({
        success: true,
        message: 'Usuário excluído com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
}