// Controller for patient-specific operations
import { Request, Response } from 'express';
import { MongoUserDAO } from '../daos/impl/MongoUserDAO';
import { TipoHumor, Humor } from '../models/Humor';
import { RegistroHumorDTO } from '../dtos/paciente/RegistroHumorDTO';
import { UserRole } from '../utils/constants';
import { AppError, NotFoundError, ForbiddenError } from '../utils/AppError';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

// Import DAO for Humor when implemented
// import { MongoHumorDAO } from '../daos/impl/MongoHumorDAO';

export class PacienteController {
  private userDAO: MongoUserDAO;
  // private humorDAO: MongoHumorDAO;
  
  constructor() {
    this.userDAO = new MongoUserDAO();
    // this.humorDAO = new MongoHumorDAO();
  }
  
  /**
   * Registra um novo estado de humor para o paciente
   */
  async registrarHumor(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      
      // Verifica se o usuário é um paciente
      if (req.user.userRole !== UserRole.PACIENTE) {
        throw ForbiddenError();
      }
      
      // Cria o DTO de registro de humor
      const registroDTO = new RegistroHumorDTO({
        pacienteId: userId,
        tipo: req.body.tipo,
        nivel: req.body.nivel,
        notas: req.body.notas
      });
      
      // Validação dos dados
      const validationErrors = registroDTO.validate();
      if (validationErrors.length > 0) {
        throw new AppError(validationErrors.join(', '), 400);
      }
      
      // Busca o paciente para verificar se existe
      const paciente = await this.userDAO.findPacienteById(userId);
      if (!paciente) {
        throw NotFoundError('Paciente');
      }
      
      // Cria o registro de humor
      const humor = new Humor({
        id: uuidv4(),
        pacienteId: userId,
        tipo: registroDTO.tipo,
        nivel: registroDTO.nivel,
        notas: registroDTO.notas
      });
      
      // TODO: Persistir no banco de dados quando HumorDAO for implementado
      // const savedHumor = await this.humorDAO.create(humor);
      
      // Simulando o salvamento para demonstração
      const savedHumor = humor;
      
      return res.status(201).json(savedHumor.toJSON());
    } catch (error) {
      logger.error(`Erro ao registrar humor: ${error.message}`);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
  
  /**
   * Obtém o histórico de humor do paciente
   */
  async obterHistoricoHumor(req: Request, res: Response) {
    try {
      const userId = req.user.userId;
      
      // Verifica se o usuário é um paciente ou profissional
      if (![UserRole.PACIENTE, UserRole.PROFISSIONAL].includes(req.user.userRole)) {
        throw ForbiddenError();
      }
      
      // Se for um profissional, verifica se o pacienteId foi fornecido
      let pacienteId = userId;
      if (req.user.userRole === UserRole.PROFISSIONAL) {
        pacienteId = req.params.pacienteId;
        if (!pacienteId) {
          throw new AppError('ID do paciente é obrigatório', 400);
        }
        
        // Verifica se o paciente existe
        const paciente = await this.userDAO.findPacienteById(pacienteId);
        if (!paciente) {
          throw NotFoundError('Paciente');
        }
      }
      
      // TODO: Buscar os registros de humor do paciente quando HumorDAO for implementado
      // const registros = await this.humorDAO.findByPacienteId(pacienteId);
      
      // Dados simulados para demonstração
      const registros = [
        new Humor({
          id: '1',
          pacienteId,
          tipo: TipoHumor.BOM,
          nivel: 8,
          dataRegistro: new Date(Date.now() - 24 * 60 * 60 * 1000), // ontem
          notas: 'Me senti bem hoje'
        }),
        new Humor({
          id: '2',
          pacienteId,
          tipo: TipoHumor.NEUTRO,
          nivel: 5,
          dataRegistro: new Date(), // hoje
          notas: 'Dia normal'
        })
      ];
      
      return res.status(200).json(registros.map(r => r.toJSON()));
    } catch (error) {
      logger.error(`Erro ao obter histórico de humor: ${error.message}`);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}
