// User DAO interface
import { BaseDAO } from './BaseDAO';
import { User } from '../models/User';
import { Paciente } from '../models/Paciente';
import { Profissional } from '../models/Profissional';
import { UserRole } from '../utils/constants';

export interface UserDAO extends BaseDAO<User> {
  findByEmail(email: string): Promise<User | null>;
  findByEmailWithPassword(email: string): Promise<User | null>;
  updatePassword(id: string, newPassword: string): Promise<boolean>;
  
  // Métodos específicos para pacientes
  createPaciente(paciente: Paciente): Promise<Paciente>;
  findPacienteById(id: string): Promise<Paciente | null>;
  
  // Métodos específicos para profissionais
  createProfissional(profissional: Profissional): Promise<Profissional>;
  findProfissionalById(id: string): Promise<Profissional | null>;
  findProfissionalByCRM(crm: string): Promise<Profissional | null>;
  
  // Métodos para consultas específicas
  findUsersByRole(role: UserRole): Promise<User[]>;
}
