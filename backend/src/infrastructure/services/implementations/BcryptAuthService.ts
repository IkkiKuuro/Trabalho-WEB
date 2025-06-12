import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../../../core/ports/services/IAuthService';

export class BcryptAuthService implements IAuthService {
  private readonly JWT_SECRET: string;
  private readonly SALT_ROUNDS: number;

  constructor() {
    // Idealmente, isso viria de variáveis de ambiente
    this.JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_muito_segura';
    this.SALT_ROUNDS = 10;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(userId: string, userRole: string): string {
    return jwt.sign(
      { userId, userRole },
      this.JWT_SECRET,
      { expiresIn: '24h' } // Token válido por 24 horas
    );
  }

  verifyToken(token: string): { userId: string; userRole: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string; userRole: string };
      return decoded;
    } catch (error) {
      return null; // Token inválido ou expirado
    }
  }
}