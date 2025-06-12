// Implementation of authentication service
import { AuthService } from '../AuthService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '../../utils/constants';
import logger from '../../utils/logger';

export class BcryptJwtAuthService implements AuthService {
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      logger.error(`Error hashing password: ${error.message}`);
      throw error;
    }
  }
  
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
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
