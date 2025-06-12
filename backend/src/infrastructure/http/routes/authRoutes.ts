// Authentication routes
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRouter = Router();
const authController = new AuthController();

// Login route
authRouter.post('/login', (req, res) => authController.login(req, res));

// Register route
authRouter.post('/register', (req, res) => authController.register(req, res));

export default authRouter;
