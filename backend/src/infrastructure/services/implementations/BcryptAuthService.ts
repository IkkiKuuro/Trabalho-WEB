import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../../../core/ports/gateways/IAuthService';
import { AppError } from '../../utils/AppError';

export class BcryptAuthService implements IAuthService {
  private readonly jwtSecret: string;
  private readonly saltRounds: number;
  private readonly tokenExpiresIn: string;

  constructor() {
    // Configurações das variáveis de ambiente
    this.jwtSecret = process.env.JWT_SECRET || 'default_secret_key_change_in_production';
    this.saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
    this.tokenExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
    
    // Verificação de segurança
    if (process.env.NODE_ENV === 'production' && this.jwtSecret === 'default_secret_key_change_in_production') {
      console.warn('AVISO: Usando chave JWT padrão em ambiente de produção. Isso é inseguro.');
    }
  }

  /**
   * Cria um hash da senha fornecida
   */
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      throw new AppError('Erro ao gerar hash da senha', 500);
    }
  }

  /**
   * Compara uma senha em texto com seu hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new AppError('Erro ao verificar senha', 500);
    }
  }

  /**
   * Gera um token JWT com as informações do usuário
   */
  generateToken(userId: string, userRole: string): string {
    try {
      return jwt.sign(
        { userId, userRole },
        this.jwtSecret,
        { expiresIn: this.tokenExpiresIn }
      );
    } catch (error) {
      throw new AppError('Erro ao gerar token', 500);
    }
  }

  /**
   * Verifica e decodifica um token JWT
   */
  verifyToken(token: string): { userId: string; userRole: string } | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string; userRole: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }
}