// Routes for patient-specific operations
import { Router } from 'express';
import { authMiddleware, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../utils/constants';
import { ControllerFactory } from '../factories/ControllerFactory';

const pacienteRouter = Router();
const pacienteController = ControllerFactory.createPacienteController();

// All routes require authentication
pacienteRouter.use(authMiddleware);

// Registro de humor (apenas pacientes)
pacienteRouter.post(
  '/humor', 
  authorize([UserRole.PACIENTE]),
  (req, res) => pacienteController.registrarHumor(req, res)
);

// Obter histórico de humor (pacientes podem ver o próprio, profissionais podem ver de qualquer paciente)
pacienteRouter.get(
  '/humor', 
  authorize([UserRole.PACIENTE]),
  (req, res) => pacienteController.obterHistoricoHumor(req, res)
);

// Rota para profissionais verem o humor de um paciente específico
pacienteRouter.get(
  '/:pacienteId/humor', 
  authorize([UserRole.PROFISSIONAL]),
  (req, res) => pacienteController.obterHistoricoHumor(req, res)
);

export default pacienteRouter;
