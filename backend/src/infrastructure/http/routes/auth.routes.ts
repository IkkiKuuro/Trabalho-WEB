import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/authController';
import { validate } from '../midalewares/validationMiddleware';
import { authenticate } from '../midalewares/authMiddleware';

const authRouter = Router();
const authController = new AuthController();

// Validação para o registro
const registerValidation = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('A senha deve ter pelo menos 6 caracteres'),
  body('tipo')
    .isIn(['PACIENTE', 'PROFISSIONAL', 'ADMIN'])
    .withMessage('Tipo de usuário inválido')
];

// Validação para login
const loginValidation = [
  body('email').isEmail().withMessage('E-mail inválido'),
  body('senha').notEmpty().withMessage('Senha é obrigatória')
];

// Rota para registro de usuários
authRouter.post(
  '/register',
  validate(registerValidation),
  authController.register.bind(authController)
);

// Rota para login
authRouter.post(
  '/login',
  validate(loginValidation),
  authController.login.bind(authController)
);

// Rota para validar token (protegida por autenticação)
authRouter.get(
  '/validate-token',
  authenticate,
  authController.validateToken.bind(authController)
);

export default authRouter;