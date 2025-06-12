// Authentication middleware
import { Request, Response, NextFunction } from 'express';
import { BcryptJwtAuthService } from '../services/impl/BcryptJwtAuthService';
import { AppError, UnauthorizedError } from '../utils/AppError';
import logger from '../utils/logger';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        userRole: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw UnauthorizedError();
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const authService = new BcryptJwtAuthService();
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      throw UnauthorizedError();
    }
    
    // Add user info to request
    req.user = {
      userId: decoded.userId,
      userRole: decoded.userRole
    };
    
    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    
    return res.status(401).json({ error: 'Não autorizado' });
  }
};

// Role-based authorization middleware
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw UnauthorizedError();
      }
      
      if (!allowedRoles.includes(req.user.userRole)) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
      next();
    } catch (error) {
      logger.error(`Authorization middleware error: ${error.message}`);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(403).json({ error: 'Acesso negado' });
    }
  };
};
