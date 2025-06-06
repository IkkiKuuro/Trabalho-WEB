import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { HttpErrors } from '../../utils/AppError';

/**
 * Middleware para verificar os resultados da validação do express-validator
 * Se houver erros, retorna uma resposta com os detalhes
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Executar todas as validações
    await Promise.all(validations.map(validation => validation.run(req)));

    // Verificar se há erros
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Formatar os erros para uma resposta amigável
    const formattedErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));

    // Retornar erro 400 com detalhes das validações que falharam
    return next(HttpErrors.badRequest('Erros de validação', formattedErrors));
  };
};