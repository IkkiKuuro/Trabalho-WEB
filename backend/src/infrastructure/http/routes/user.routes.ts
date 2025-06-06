import { Router } from 'express';
import { body, param } from 'express-validator';
import { UserController } from '../controllers/userController';
import { validate } from '../midalewares/validationMiddleware';
import { authenticate, authorize } from '../midalewares/authMiddleware';

const userRouter = Router();
const userController = new UserController();

// Validação para atualização de usuário
const updateUserValidation = [
  param('id').isMongoId().withMessage('ID de usuário inválido'),
  body('nome').optional().trim().notEmpty().withMessage('Nome não pode estar vazio'),
  body('email').optional().isEmail().withMessage('E-mail inválido')
];

// Validação para obter e excluir usuário
const userIdValidation = [
  param('id').isMongoId().withMessage('ID de usuário inválido')
];

// Obter usuário por ID (protegido por autenticação)
userRouter.get(
  '/:id',
  authenticate,
  validate(userIdValidation),
  userController.getUserById.bind(userController)
);

// Atualizar usuário (protegido por autenticação)
userRouter.put(
  '/:id',
  authenticate,
  validate(updateUserValidation),
  userController.updateUser.bind(userController)
);

// Excluir usuário (protegido por autenticação e autorização)
userRouter.delete(
  '/:id',
  authenticate,
  validate(userIdValidation),
  userController.deleteUser.bind(userController)
);

// Rota para listar todos os usuários (apenas para admin)
userRouter.get(
  '/',
  authenticate,
  authorize(['ADMIN']),
  (req, res) => {
    res.status(501).json({
      success: false,
      message: 'Rota ainda não implementada'
    });
  }
);

export default userRouter;