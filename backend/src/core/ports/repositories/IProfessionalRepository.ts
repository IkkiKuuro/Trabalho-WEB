import { Profissional } from '../../domain/Profissional';

export interface IProfessionalRepository {
  findById(id: string): Promise<Profissional | null>;
  findByUserId(userId: string): Promise<Profissional | null>;
  save(profissional: Profissional): Promise<Profissional>;
  update(profissional: Profissional): Promise<Profissional>;
  delete(id: string): Promise<void>;
  listAll(): Promise<Profissional[]>;
  // Métodos específicos para profissionais
  assignTaskToPatient(profissionalId: string, pacienteId: string, tarefa: any): Promise<any>;
  getPatients(profissionalId: string): Promise<any[]>;
}
