// Modelo de tarefa no padrão MVC
export enum TaskStatus {
  PENDENTE = 'PENDENTE',
  CONCLUIDA = 'CONCLUIDA',
  ATRASADA = 'ATRASADA'
}

export class Tarefa {
  id: string;
  pacienteId: string;
  profissionalId: string;
  descricao: string;
  dataCriacao: Date;
  dataLimite: Date;
  status: TaskStatus;
  observacoesPaciente?: string;
  concluida: boolean;

  constructor(data: {
    id?: string;
    pacienteId: string;
    profissionalId: string;
    descricao: string;
    dataCriacao?: Date;
    dataLimite: Date;
    status?: TaskStatus;
    observacoesPaciente?: string;
    concluida?: boolean;
  }) {
    const dataCriacao = data.dataCriacao || new Date();
    
    // Validação da data limite
    if (data.dataLimite < dataCriacao) {
      throw new Error('A data limite não pode ser anterior à data de criação');
    }
    
    this.id = data.id || '';
    this.pacienteId = data.pacienteId;
    this.profissionalId = data.profissionalId;
    this.descricao = data.descricao;
    this.dataCriacao = dataCriacao;
    this.dataLimite = data.dataLimite;
    this.status = data.status || TaskStatus.PENDENTE;
    this.observacoesPaciente = data.observacoesPaciente;
    this.concluida = data.concluida || false;
  }

  // Método para verificar se a tarefa está atrasada
  verificarAtraso(): boolean {
    const agora = new Date();
    if (agora > this.dataLimite && this.status !== TaskStatus.CONCLUIDA) {
      this.status = TaskStatus.ATRASADA;
      return true;
    }
    return false;
  }

  // Método para transformar o objeto em formato JSON
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
