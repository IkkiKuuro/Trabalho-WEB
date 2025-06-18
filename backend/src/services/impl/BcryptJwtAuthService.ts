// Implementation of authentication service
import { AuthService } from '../AuthService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '../../utils/constants';
import logger from '../../utils/logger';

/**
 * Implementação do AuthService usando bcrypt para hash e JWT para tokens
 */
export class BcryptJwtAuthService implements AuthService {
  private readonly saltRounds: number = 10;
  
  /**
   * Gera um hash para a senha usando bcrypt
   * @param password Senha em texto puro
   * @returns Hash da senha
   */
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error: any) {
      logger.error(`Error hashing password: ${error.message}`);
      throw new Error('Falha ao gerar hash da senha');
    }
  }
  
  /**
   * Compara uma senha com um hash usando bcrypt
   * @param password Senha em texto puro
   * @param hashedPassword Hash armazenado
   * @returns Booleano indicando se a senha é válida
   */
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error: any) {
      logger.error(`Error comparing passwords: ${error.message}`);
      return false;
    }
  }
  
  generateToken(userId: string, userRole: string): string {
    try {
      return jwt.sign(
        { userId, userRole },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );
    } catch (error) {
      logger.error(`Error generating token: ${error.message}`);
      throw error;
    }
  }
  
  verifyToken(token: string): { userId: string; userRole: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return {
        userId: decoded.userId,
        userRole: decoded.userRole
      };
    } catch (error) {
      logger.error(`Error verifying token: ${error.message}`);
      return null;
    }
  }
}
