// Modelo de humor no padrão MVC
export enum TipoHumor {
  MUITO_BOM = 'MUITO_BOM',
  BOM = 'BOM',
  NEUTRO = 'NEUTRO',
  RUIM = 'RUIM',
  MUITO_RUIM = 'MUITO_RUIM'
}

export class Humor {
  id: string;
  pacienteId: string;
  dataRegistro: Date;
  tipo: TipoHumor;
  nivel: number; // Escala de 1 a 10
  notas?: string;

  constructor(data: {
    id?: string;
    pacienteId: string;
    dataRegistro?: Date;
    tipo: TipoHumor;
    nivel: number;
    notas?: string;
  }) {
    // Validação para o nível de humor
    if (data.nivel < 1 || data.nivel > 10) {
      throw new Error('Nível de humor deve estar entre 1 e 10');
    }
    
    this.id = data.id || '';
    this.pacienteId = data.pacienteId;
    this.dataRegistro = data.dataRegistro || new Date();
    this.tipo = data.tipo;
    this.nivel = data.nivel;
    this.notas = data.notas;
  }

  // Método para transformar o objeto em formato JSON
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
