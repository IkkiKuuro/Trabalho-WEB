export enum TipoHumor {
  MUITO_BOM = 'MUITO_BOM',
  BOM = 'BOM',
  NEUTRO = 'NEUTRO',
  RUIM = 'RUIM',
  MUITO_RUIM = 'MUITO_RUIM'
}

export type HumorProps = {
  id: string;
  pacienteId: string;
  dataRegistro: Date;
  tipo: TipoHumor;
  nivel: number; // Escala de 1 a 10
  notas?: string;
};

export class Humor {
  private readonly props: HumorProps;

  constructor(props: HumorProps) {
    // Validação para o nível de humor
    if (props.nivel < 1 || props.nivel > 10) {
      throw new Error('Nível de humor deve estar entre 1 e 10');
    }
    
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get pacienteId(): string {
    return this.props.pacienteId;
  }

  get dataRegistro(): Date {
    return this.props.dataRegistro;
  }

  get tipo(): TipoHumor {
    return this.props.tipo;
  }

  get nivel(): number {
    return this.props.nivel;
  }

  get notas(): string | undefined {
    return this.props.notas;
  }

  // Método para atualizar as notas
  atualizarNotas(notas: string): void {
    this.props.notas = notas;
  }

  // Método para transformar o objeto em um formato mais simples
  toJSON() {
    return {
      id: this.id,
      pacienteId: this.pacienteId,
      dataRegistro: this.dataRegistro,
      tipo: this.tipo,
      nivel: this.nivel,
      notas: this.notas
    };
  }
}