// Classe para representar erros da aplicação
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Erros comuns predefinidos
export const NotFoundError = (resource: string) => 
  new AppError(`${resource} não encontrado`, 404);

export const UnauthorizedError = () => 
  new AppError('Não autorizado', 401);

export const ForbiddenError = () => 
  new AppError('Acesso negado', 403);

export const ValidationError = (message: string) => 
  new AppError(message, 400);

export const InternalServerError = () => 
  new AppError('Erro interno do servidor', 500, false);
