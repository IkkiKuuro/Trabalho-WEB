// DAO for Humor (mood tracking)
import { BaseDAO } from './BaseDAO';
import { Humor } from '../models/Humor';

export interface HumorDAO extends BaseDAO<Humor> {
  findByPacienteId(pacienteId: string): Promise<Humor[]>;
  findByPacienteIdAndDateRange(pacienteId: string, startDate: Date, endDate: Date): Promise<Humor[]>;
  getHumorStatsByPacienteId(pacienteId: string): Promise<any>; // Stats about patient's mood patterns
}
