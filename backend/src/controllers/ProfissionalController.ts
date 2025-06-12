// Controller for professional-specific operations
import { Request, Response } from 'express';
import { MongoUserDAO } from '../daos/impl/MongoUserDAO';
import { Tarefa, TaskStatus } from '../models/Tarefa';
import { StatusConsulta, Consulta } from '../models/Consulta';
import { UserRole } from '../utils/constants';
import { AppError, NotFoundError, ForbiddenError } from '../utils/AppError';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { CriarTarefaDTO } from '../dtos/profissional/CriarTarefaDTO';
import { AgendarConsultaDTO } from '../dtos/profissional/AgendarConsultaDTO';

// Import DAOs when implemented
// import { MongoTarefaDAO } from '../daos/impl/MongoTarefaDAO';
// import { MongoConsultaDAO } from '../daos/impl/MongoConsultaDAO';

export class ProfissionalController {
  private userDAO: MongoUserDAO;
  // private tarefaDAO: MongoTarefaDAO;
  // private consultaDAO: MongoConsultaDAO;
  
  constructor() {
    this.userDAO = new MongoUserDAO();
    // this.tarefaDAO = new MongoTarefaDAO();
    // this.consultaDAO = new MongoConsultaDAO();
  }
    /**
   * Lista todos os pacientes (apenas para profissionais)
   */
  async listarPacientes(req: Request, res: Response) {
    try {
      // Verifica se o usuário é um profissional
      if (req.user.userRole !== UserRole.PROFISSIONAL) {
        throw ForbiddenError();
      }
      
      // Busca todos os pacientes
      const pacientes = await this.userDAO.findUsersByRole(UserRole.PACIENTE);
      
      // Remove informações sensíveis
      const pacientesSeguros = pacientes.map(p => p.toJSON());
      
      return res.status(200).json(pacientesSeguros);
    } catch (error: any) {
      logger.error(`Erro ao listar pacientes: ${error.message}`);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
    /**
   * Atribui uma tarefa a um paciente
   */
  async atribuirTarefa(req: Request, res: Response) {
    try {
      const profissionalId = req.user.userId;
      
      // Verifica se o usuário é um profissional
      if (req.user.userRole !== UserRole.PROFISSIONAL) {
        throw ForbiddenError();
      }
      
      // Cria o DTO com os dados da requisição
      const tarefaDTO = new CriarTarefaDTO({
        pacienteId: req.body.pacienteId,
        profissionalId,
        descricao: req.body.descricao,
        dataLimite: req.body.dataLimite,
        observacoes: req.body.observacoes
      });
      
      // Validação dos dados
      const validationErrors = tarefaDTO.validate();
      if (validationErrors.length > 0) {
        throw new AppError(validationErrors.join(', '), 400);
      }
      
      // Verifica se o paciente existe
      const paciente = await this.userDAO.findPacienteById(tarefaDTO.pacienteId);
      if (!paciente) {
        throw NotFoundError('Paciente');
      }
      
      // Cria a tarefa
      const tarefa = new Tarefa({
        id: uuidv4(),
        pacienteId: tarefaDTO.pacienteId,
        profissionalId,
        descricao: tarefaDTO.descricao,
        dataLimite: tarefaDTO.dataLimite
      });
      
      // TODO: Persistir no banco de dados quando TarefaDAO for implementado
      // const savedTarefa = await this.tarefaDAO.create(tarefa);
      
      // Simulando o salvamento para demonstração
      const savedTarefa = tarefa;
      
      return res.status(201).json(savedTarefa.toJSON());
    } catch (error) {
      logger.error(`Erro ao atribuir tarefa: ${error.message}`);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
  
  /**
   * Agenda uma consulta com um paciente
   */
  async agendarConsulta(req: Request, res: Response) {
    try {
      const profissionalId = req.user.userId;
      
      // Verifica se o usuário é um profissional
      if (req.user.userRole !== UserRole.PROFISSIONAL) {
        throw ForbiddenError();
      }
      
      const { pacienteId, dataHora, duracao, modalidade } = req.body;
      
      // Validação básica
      if (!pacienteId || !dataHora) {
        throw new AppError('ID do paciente e data/hora são obrigatórios', 400);
      }
      
      // Verifica se o paciente existe
      const paciente = await this.userDAO.findPacienteById(pacienteId);
      if (!paciente) {
        throw NotFoundError('Paciente');
      }
      
      // Cria a consulta
      const consulta = new Consulta({
        id: uuidv4(),
        pacienteId,
        profissionalId,
        dataHora: new Date(dataHora),
        duracao,
        modalidade
      });
      
      // TODO: Verificar disponibilidade quando ConsultaDAO for implementado
      // const disponivel = await this.consultaDAO.checkForAvailability(profissionalId, new Date(dataHora));
      // if (!disponivel) {
      //   throw new AppError('Horário indisponível', 400);
      // }
      
      // TODO: Persistir no banco de dados quando ConsultaDAO for implementado
      // const savedConsulta = await this.consultaDAO.create(consulta);
      
      // Simulando o salvamento para demonstração
      const savedConsulta = consulta;
      
      return res.status(201).json(savedConsulta.toJSON());
    } catch (error) {
      logger.error(`Erro ao agendar consulta: ${error.message}`);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}
