// DTO para agendamento de consultas
import { StatusConsulta } from '../../models/Consulta';

export class AgendarConsultaDTO {
  pacienteId: string;
  profissionalId: string;
  dataHora: Date;
  duracao?: number; // em minutos
  modalidade?: 'PRESENCIAL' | 'ONLINE';
  observacoes?: string;

  constructor(data: {
    pacienteId: string;
    profissionalId: string;
    dataHora: string | Date;
    duracao?: number;
    modalidade?: 'PRESENCIAL' | 'ONLINE';
    observacoes?: string;
  }) {
    this.pacienteId = data.pacienteId;
    this.profissionalId = data.profissionalId;
    this.dataHora = typeof data.dataHora === 'string' 
      ? new Date(data.dataHora)
      : data.dataHora;
    this.duracao = data.duracao;
    this.modalidade = data.modalidade;
    this.observacoes = data.observacoes;
  }

  // Método para validar os dados de agendamento
  validate(): string[] {
    const errors: string[] = [];

    if (!this.pacienteId) errors.push('ID do paciente é obrigatório');
    if (!this.profissionalId) errors.push('ID do profissional é obrigatório');
    if (!this.dataHora) errors.push('Data e hora são obrigatórias');
    
    // Verifica se a data/hora é válida
    if (this.dataHora instanceof Date && isNaN(this.dataHora.getTime())) {
      errors.push('Data e hora inválidas');
    }
    
    // Verifica se a data/hora não é passada
    const agora = new Date();
    if (this.dataHora && this.dataHora < agora) {
      errors.push('A data e hora não podem ser no passado');
    }
    
    // Validação da duração
    if (this.duracao !== undefined && (this.duracao <= 0 || !Number.isInteger(this.duracao))) {
      errors.push('A duração deve ser um número inteiro positivo (em minutos)');
    }
    
    // Validação da modalidade
    if (this.modalidade && !['PRESENCIAL', 'ONLINE'].includes(this.modalidade)) {
      errors.push('Modalidade deve ser PRESENCIAL ou ONLINE');
    }

    return errors;
  }
}
