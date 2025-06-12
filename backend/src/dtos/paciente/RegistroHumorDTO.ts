// DTO para registro de humor
import { TipoHumor } from '../../models/Humor';

export class RegistroHumorDTO {
  pacienteId: string;
  tipo: TipoHumor;
  nivel: number;
  notas?: string;

  constructor(data: {
    pacienteId: string;
    tipo: TipoHumor;
    nivel: number;
    notas?: string;
  }) {
    this.pacienteId = data.pacienteId;
    this.tipo = data.tipo;
    this.nivel = data.nivel;
    this.notas = data.notas;
  }

  // Método para validar os dados de registro de humor
  validate(): string[] {
    const errors: string[] = [];

    if (!this.pacienteId) errors.push('ID do paciente é obrigatório');
    if (!Object.values(TipoHumor).includes(this.tipo)) 
      errors.push('Tipo de humor inválido');
    if (this.nivel < 1 || this.nivel > 10)
      errors.push('Nível de humor deve estar entre 1 e 10');

    return errors;
  }
}
