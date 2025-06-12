// DTO para criação de tarefas
export class CriarTarefaDTO {
  pacienteId: string;
  profissionalId: string;
  descricao: string;
  dataLimite: Date;
  observacoes?: string;

  constructor(data: {
    pacienteId: string;
    profissionalId: string;
    descricao: string;
    dataLimite: string | Date;
    observacoes?: string;
  }) {
    this.pacienteId = data.pacienteId;
    this.profissionalId = data.profissionalId;
    this.descricao = data.descricao;
    this.dataLimite = typeof data.dataLimite === 'string' 
      ? new Date(data.dataLimite)
      : data.dataLimite;
    this.observacoes = data.observacoes;
  }

  // Método para validar os dados de criação de tarefa
  validate(): string[] {
    const errors: string[] = [];

    if (!this.pacienteId) errors.push('ID do paciente é obrigatório');
    if (!this.profissionalId) errors.push('ID do profissional é obrigatório');
    if (!this.descricao) errors.push('Descrição é obrigatória');
    if (!this.dataLimite) errors.push('Data limite é obrigatória');
    
    // Verifica se a data limite é válida
    if (this.dataLimite instanceof Date && isNaN(this.dataLimite.getTime())) {
      errors.push('Data limite inválida');
    }
    
    const agora = new Date();
    if (this.dataLimite && this.dataLimite < agora) 
      errors.push('Data limite não pode ser no passado');

    return errors;
  }
}
