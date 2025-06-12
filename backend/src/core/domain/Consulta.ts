export enum StatusConsulta {
  AGENDADA = 'AGENDADA',
  CONFIRMADA = 'CONFIRMADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export type ConsultaProps = {
  id: string;
  pacienteId: string;
  profissionalId: string;
  dataHora: Date;
  status: StatusConsulta;
  observacoes?: string;
  duracao?: number; // Duração em minutos
  modalidade?: 'PRESENCIAL' | 'ONLINE';
};

export class Consulta {
  private readonly props: ConsultaProps;

  constructor(props: ConsultaProps) {
    // Validação da data da consulta
    if (props.dataHora < new Date()) {
      throw new Error('A data da consulta não pode ser no passado');
    }
    
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get pacienteId(): string {
    return this.props.pacienteId;
  }

  get profissionalId(): string {
    return this.props.profissionalId;
  }

  get dataHora(): Date {
    return this.props.dataHora;
  }

  get status(): StatusConsulta {
    return this.props.status;
  }

  get observacoes(): string | undefined {
    return this.props.observacoes;
  }

  get duracao(): number | undefined {
    return this.props.duracao;
  }

  get modalidade(): 'PRESENCIAL' | 'ONLINE' | undefined {
    return this.props.modalidade;
  }

  // Métodos para atualizar propriedades
  confirmar(): void {
    if (this.props.status === StatusConsulta.AGENDADA) {
      this.props.status = StatusConsulta.CONFIRMADA;
    } else {
      throw new Error('Apenas consultas agendadas podem ser confirmadas');
    }
  }

  iniciar(): void {
    if (this.props.status === StatusConsulta.CONFIRMADA) {
      this.props.status = StatusConsulta.EM_ANDAMENTO;
    } else {
      throw new Error('Apenas consultas confirmadas podem ser iniciadas');
    }
  }

  concluir(observacoes?: string): void {
    if (this.props.status === StatusConsulta.EM_ANDAMENTO) {
      this.props.status = StatusConsulta.CONCLUIDA;
      if (observacoes) {
        this.adicionarObservacoes(observacoes);
      }
    } else {
      throw new Error('Apenas consultas em andamento podem ser concluídas');
    }
  }

  cancelar(motivo: string): void {
    if (this.props.status !== StatusConsulta.CONCLUIDA && 
        this.props.status !== StatusConsulta.CANCELADA) {
      this.props.status = StatusConsulta.CANCELADA;
      this.adicionarObservacoes(`Cancelamento: ${motivo}`);
    } else {
      throw new Error('Não é possível cancelar uma consulta concluída ou já cancelada');
    }
  }

  adicionarObservacoes(observacao: string): void {
    this.props.observacoes = this.props.observacoes 
      ? `${this.props.observacoes}\n${observacao}`
      : observacao;
  }

  reagendar(novaData: Date): void {
    if (novaData < new Date()) {
      throw new Error('A nova data não pode ser no passado');
    }
    
    if (this.props.status !== StatusConsulta.CONCLUIDA && 
        this.props.status !== StatusConsulta.CANCELADA) {
      this.props.dataHora = novaData;
      this.props.status = StatusConsulta.AGENDADA;
      this.adicionarObservacoes(`Reagendada para ${novaData.toLocaleString()}`);
    } else {
      throw new Error('Não é possível reagendar uma consulta concluída ou cancelada');
    }
  }

  // Método para transformar o objeto em um formato mais simples
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