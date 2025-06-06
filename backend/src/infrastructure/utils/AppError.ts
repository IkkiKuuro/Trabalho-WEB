
/**
 * Classe customizada para erros de aplicação
 * Permite definir status HTTP e detalhes adicionais para erros
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, statusCode = 400, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'AppError';
    
    // Capturando o stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Tipos de erros comuns na aplicação
 */
export const ErrorTypes = {
  VALIDATION_ERROR: 'ValidationError',
  AUTHENTICATION_ERROR: 'AuthenticationError',
  AUTHORIZATION_ERROR: 'AuthorizationError',
  NOT_FOUND_ERROR: 'NotFoundError',
  BUSINESS_RULE_ERROR: 'BusinessRuleError',
  INFRASTRUCTURE_ERROR: 'InfrastructureError',
};

/**
 * Função auxiliar para gerar erros HTTP comuns
 */
export const HttpErrors = {
  badRequest: (message: string, details?: any) => new AppError(message, 400, details),
  unauthorized: (message: string, details?: any) => new AppError(message, 401, details),
  forbidden: (message: string, details?: any) => new AppError(message, 403, details),
  notFound: (message: string, details?: any) => new AppError(message, 404, details),
  conflict: (message: string, details?: any) => new AppError(message, 409, details),
  internal: (message: string, details?: any) => new AppError(message, 500, details),
};