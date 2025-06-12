import { TaskStatus } from "../../shared/types/common";

export type TarefaProps = {
  id: string;
  pacienteId: string;
  profissionalId: string;
  descricao: string;
  dataCriacao: Date;
  dataLimite: Date;
  status: TaskStatus;
  observacoesPaciente?: string;
  concluida?: boolean;
};

export class Tarefa {
  private readonly props: TarefaProps;

  constructor(props: TarefaProps) {
    // Validação da data limite
    if (props.dataLimite < props.dataCriacao) {
      throw new Error('A data limite não pode ser anterior à data de criação');
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

  get descricao(): string {
    return this.props.descricao;
  }

  get dataCriacao(): Date {
    return this.props.dataCriacao;
  }

  get dataLimite(): Date {
    return this.props.dataLimite;
  }

  get status(): TaskStatus {
    return this.props.status;
  }

  get observacoesPaciente(): string | undefined {
    return this.props.observacoesPaciente;
  }

  get concluida(): boolean {
    return this.props.concluida || false;
  }

  // Métodos para atualizar propriedades
  marcarComoConcluida(): void {
    this.props.status = TaskStatus.CONCLUIDA;
    this.props.concluida = true;
  }

  adicionarObservacao(observacao: string): void {
    this.props.observacoesPaciente = this.props.observacoesPaciente 
      ? `${this.props.observacoesPaciente}\n${observacao}`
      : observacao;
  }

  atualizarStatus(status: TaskStatus): void {
    this.props.status = status;
    if (status === TaskStatus.CONCLUIDA) {
      this.props.concluida = true;
    }
  }

  verificarAtraso(): boolean {
    const agora = new Date();
    if (agora > this.props.dataLimite && this.props.status !== TaskStatus.CONCLUIDA) {
      this.props.status = TaskStatus.ATRASADA;
      return true;
    }
    return false;
  }

  // Método para transformar o objeto em um formato mais simples
  toJSON() {
    return {
      id: this.id,
      pacienteId: this.pacienteId,
      profissionalId: this.profissionalId,
      descricao: this.descricao,
      dataCriacao: this.dataCriacao,
      dataLimite: this.dataLimite,
      status: this.status,
      observacoesPaciente: this.observacoesPaciente,
      concluida: this.concluida
    };
  }
}