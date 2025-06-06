import { IUserRepository } from '../../../core/ports/gateways/IUserRepository';
import { User } from '../../../core/domain/User';
import prismaClient from './PrismaClientInstance';
import logger from '../../utils/logger';
import { AppError } from '../../utils/AppError';

export class PrismaUserRepository implements IUserRepository {
  /**
   * Busca um usuário pelo endereço de e-mail
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await prismaClient.usuario.findUnique({
        where: { email }
      });

      if (!user) return null;

      // Mapeando o modelo do Prisma para o modelo de domínio
      return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        passwordHash: user.senha,
        tipo: user.tipo,
        dataCadastro: user.dataCadastro,
        dataAtualizacao: user.dataAtualizacao || new Date()
      };
    } catch (error) {
      logger.error('Erro ao buscar usuário por e-mail', error);
      throw new AppError('Erro ao buscar usuário', 500);
    }
  }

  /**
   * Busca um usuário pelo ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      const user = await prismaClient.usuario.findUnique({
        where: { id }
      });

      if (!user) return null;

      // Mapeando o modelo do Prisma para o modelo de domínio
      return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        passwordHash: user.senha,
        tipo: user.tipo,
        dataCadastro: user.dataCadastro,
        dataAtualizacao: user.dataAtualizacao || new Date()
      };
    } catch (error) {
      logger.error('Erro ao buscar usuário por ID', error);
      throw new AppError('Erro ao buscar usuário', 500);
    }
  }

  /**
   * Salva ou atualiza um usuário
   */
  async save(user: User): Promise<User> {
    try {
      // Verificar se o usuário já existe
      const existingUser = user.id ? await prismaClient.usuario.findUnique({
        where: { id: user.id }
      }) : null;

      // Se existir, atualiza; senão, cria
      const savedUser = await prismaClient.usuario.upsert({
        where: { 
          id: user.id || 'new-user' // 'new-user' é um ID que nunca existirá
        },
        update: {
          nome: user.nome,
          email: user.email,
          senha: user.passwordHash,
          tipo: user.tipo,
          dataAtualizacao: new Date()
        },
        create: {
          nome: user.nome,
          email: user.email,
          senha: user.passwordHash,
          tipo: user.tipo,
          dataCadastro: user.dataCadastro || new Date(),
          dataAtualizacao: new Date()
        }
      });

      // Mapeando de volta para o modelo de domínio
      return {
        id: savedUser.id,
        nome: savedUser.nome,
        email: savedUser.email,
        passwordHash: savedUser.senha,
        tipo: savedUser.tipo,
        dataCadastro: savedUser.dataCadastro,
        dataAtualizacao: savedUser.dataAtualizacao || new Date()
      };
    } catch (error) {
      logger.error('Erro ao salvar usuário', error);
      
      // Verificando se é um erro de duplicação de e-mail
      if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('email')) {
        throw new AppError('E-mail já está em uso', 409);
      }
      
      throw new AppError('Erro ao salvar usuário', 500);
    }
  }

  /**
   * Exclui um usuário pelo ID
   */
  async delete(id: string): Promise<void> {
    try {
      await prismaClient.usuario.delete({
        where: { id }
      });
    } catch (error) {
      logger.error('Erro ao excluir usuário', error);
      
      // Verificando se o usuário não foi encontrado
      if ((error as any).code === 'P2025') {
        throw new AppError('Usuário não encontrado', 404);
      }
      
      throw new AppError('Erro ao excluir usuário', 500);
    }
  }
}