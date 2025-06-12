import { Paciente } from '../../domain/Paciente';

export interface IPatientRepository {
  findById(id: string): Promise<Paciente | null>;
  findByUserId(userId: string): Promise<Paciente | null>;
  save(paciente: Paciente): Promise<Paciente>;
  update(paciente: Paciente): Promise<Paciente>;
  delete(id: string): Promise<void>;
  listAll(): Promise<Paciente[]>;
  // Métodos específicos para pacientes
  registerMood(pacienteId: string, humor: any): Promise<any>;
  getMoodHistory(pacienteId: string): Promise<any[]>;
}
