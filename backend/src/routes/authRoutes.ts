/**
 * Rotas de autenticação
 */
import { Router } from 'express';
import { ControllerFactory } from '../factories/ControllerFactory';

// Cria router
const authRouter = Router();

// Obtém controller com injeção de dependência
const authController = ControllerFactory.createAuthController();

// Rota de login
authRouter.post('/login', (req, res) => authController.login(req, res));

// Rota de registro
authRouter.post('/register', (req, res) => authController.register(req, res));

export default authRouter;
