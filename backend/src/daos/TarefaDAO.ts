// DAO for Tarefas (tasks)
import { BaseDAO } from './BaseDAO';
import { Tarefa, TaskStatus } from '../models/Tarefa';

export interface TarefaDAO extends BaseDAO<Tarefa> {
  findByPacienteId(pacienteId: string): Promise<Tarefa[]>;
  findByProfissionalId(profissionalId: string): Promise<Tarefa[]>;
  findByStatus(status: TaskStatus): Promise<Tarefa[]>;
  findByPacienteAndStatus(pacienteId: string, status: TaskStatus): Promise<Tarefa[]>;
  updateStatus(id: string, status: TaskStatus): Promise<Tarefa | null>;
  checkOverdueTasks(): Promise<Tarefa[]>; // Finds and updates overdue tasks
}
