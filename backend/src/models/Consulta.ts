// Modelo de consulta no padrão MVC
export enum StatusConsulta {
  AGENDADA = 'AGENDADA',
  CONFIRMADA = 'CONFIRMADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export class Consulta {
  id: string;
  pacienteId: string;
  profissionalId: string;
  dataHora: Date;
  status: StatusConsulta;
  observacoes?: string;
  duracao?: number; // Duração em minutos
  modalidade?: 'PRESENCIAL' | 'ONLINE';

  constructor(data: {
    id?: string;
    pacienteId: string;
    profissionalId: string;
    dataHora: Date;
    status?: StatusConsulta;
    observacoes?: string;
    duracao?: number;
    modalidade?: 'PRESENCIAL' | 'ONLINE';
  }) {
    // Validação da data da consulta
    if (data.dataHora < new Date() && !data.id) {
      throw new Error('A data da consulta não pode ser no passado');
    }
    
    this.id = data.id || '';
    this.pacienteId = data.pacienteId;
    this.profissionalId = data.profissionalId;
    this.dataHora = data.dataHora;
    this.status = data.status || StatusConsulta.AGENDADA;
    this.observacoes = data.observacoes;
    this.duracao = data.duracao;
    this.modalidade = data.modalidade;
  }

  // Método para transformar o objeto em formato JSON
  toJSON() {
    return {
      id: this.id,
      pacienteId: this.pacienteId,
      profissionalId: this.profissionalId,
      dataHora: this.dataHora,
      status: this.status,
      observacoes: this.observacoes,
      duracao: this.duracao,
      modalidade: this.modalidade
    };
  }
}
