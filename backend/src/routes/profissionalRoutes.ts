// Routes for professional-specific operations
import { Router } from 'express';
import { ProfissionalController } from '../controllers/ProfissionalController';
import { authMiddleware, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../utils/constants';

const profissionalRouter = Router();
const profissionalController = new ProfissionalController();

// All routes require authentication
profissionalRouter.use(authMiddleware);

// All routes require PROFISSIONAL role
profissionalRouter.use(authorize([UserRole.PROFISSIONAL]));

// Listar todos os pacientes
profissionalRouter.get(
  '/pacientes', 
  (req, res) => profissionalController.listarPacientes(req, res)
);

// Atribuir tarefa a um paciente
profissionalRouter.post(
  '/tarefas', 
  (req, res) => profissionalController.atribuirTarefa(req, res)
);

// Agendar consulta com um paciente
profissionalRouter.post(
  '/consultas', 
  (req, res) => profissionalController.agendarConsulta(req, res)
);

export default profissionalRouter;
