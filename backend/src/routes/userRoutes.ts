// User routes
import { Router } from 'express';
import { authMiddleware, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../utils/constants';
import { ControllerFactory } from '../factories/ControllerFactory';

const userRouter = Router();
const userController = ControllerFactory.createUserController();

// Protected routes - require authentication
userRouter.use(authMiddleware);

// Get user profile
userRouter.get('/profile', (req, res) => userController.getProfile(req, res));

// Update user profile
userRouter.put('/profile', (req, res) => userController.updateProfile(req, res));

// Update password
userRouter.put('/password', (req, res) => userController.updatePassword(req, res));

// Admin-only route - list all users
userRouter.get(
  '/all', 
  authorize([UserRole.ADMIN]), 
  (req, res) => userController.listUsers(req, res)
);

export default userRouter;
