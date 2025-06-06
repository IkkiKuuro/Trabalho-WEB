import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError';
import logger from '../../utils/logger';

/**
 * Middleware para tratamento centralizado de erros
 * Converte erros em respostas HTTP apropriadas
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log do erro
  logger.error(`${req.method} ${req.path} - ${err.message}`, err);

  // Se for um AppError (erro conhecido/controlado)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
  }

  // Erros de validação do Express Validator
  if (err.name === 'ValidationError' || (err as any).errors) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      details: (err as any).errors || err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
  }

  // Erros inesperados/não tratados
  const statusCode = 500;
  const message = 'Erro interno do servidor';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' ? { originalError: err.message, stack: err.stack } : {})
  });
};

/**
 * Middleware para lidar com rotas não encontradas
 */
export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
  
  res.status(404).json({
    success: false,
    message: 'Recurso não encontrado'
  });
};