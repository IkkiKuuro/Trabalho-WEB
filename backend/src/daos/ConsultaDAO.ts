// DAO for Consultas (appointments)
import { BaseDAO } from './BaseDAO';
import { Consulta, StatusConsulta } from '../models/Consulta';

export interface ConsultaDAO extends BaseDAO<Consulta> {
  findByPacienteId(pacienteId: string): Promise<Consulta[]>;
  findByProfissionalId(profissionalId: string): Promise<Consulta[]>;
  findByStatus(status: StatusConsulta): Promise<Consulta[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Consulta[]>;
  findUpcomingByPacienteId(pacienteId: string): Promise<Consulta[]>;
  findUpcomingByProfissionalId(profissionalId: string): Promise<Consulta[]>;
  updateStatus(id: string, status: StatusConsulta): Promise<Consulta | null>;
  checkForAvailability(profissionalId: string, date: Date): Promise<boolean>;
}
