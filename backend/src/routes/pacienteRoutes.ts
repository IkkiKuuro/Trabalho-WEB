// Routes for patient-specific operations
import { Router } from 'express';
import { PacienteController } from '../controllers/PacienteController';
import { authMiddleware, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../utils/constants';

const pacienteRouter = Router();
const pacienteController = new PacienteController();

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
