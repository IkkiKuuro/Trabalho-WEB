import { Request, Response, NextFunction } from 'express';
import { BcryptAuthService } from '../../services/implementations/BcryptAuthService';
import { HttpErrors } from '../../utils/AppError';

// Instanciando o serviço de autenticação
const authService = new BcryptAuthService();

/**
 * Middleware para verificar se o usuário está autenticado
 * Extrai o token do cabeçalho Authorization e verifica sua validade
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar se o cabeçalho Authorization existe
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw HttpErrors.unauthorized('Token não fornecido');
    }

    // Extrair o token do formato "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      throw HttpErrors.unauthorized('Formato de token inválido');
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      throw HttpErrors.unauthorized('Formato de token inválido');
    }

    // Verificar e decodificar o token
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      throw HttpErrors.unauthorized('Token inválido ou expirado');
    }

    // Adicionar as informações do usuário ao objeto request
    req.user = decoded;
    
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Middleware para verificar se o usuário tem a role necessária
 * Deve ser usado após o middleware authenticate
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar se o usuário está autenticado
      if (!req.user) {
        throw HttpErrors.unauthorized('Usuário não autenticado');
      }

      // Verificar se o usuário tem a role necessária
      const userRole = (req.user as any).userRole;
      
      if (!allowedRoles.includes(userRole)) {
        throw HttpErrors.forbidden('Acesso não autorizado para este recurso');
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

// Adicionar a propriedade user ao objeto Request do Express
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}