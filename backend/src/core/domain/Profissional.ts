import { User, UserProps } from "./User";
import { UserRole } from "../../shared/types/common";

export type ProfissionalProps = UserProps & {
  tipo: UserRole.PROFISSIONAL;
  crm: string; // Registro profissional único
  especialidade: string;
  biografia?: string;
  horariosDisponiveis?: string[]; // Pode armazenar slots de horários disponíveis
};

export class Profissional extends User {
  private readonly _props: ProfissionalProps;

  constructor(props: ProfissionalProps) {
    super(props);
    this._props = props;
  }

  get crm(): string {
    return this._props.crm;
  }

  get especialidade(): string {
    return this._props.especialidade;
  }

  get biografia(): string | undefined {
    return this._props.biografia;
  }

  get horariosDisponiveis(): string[] | undefined {
    return this._props.horariosDisponiveis ? [...this._props.horariosDisponiveis] : undefined;
  }

  // Métodos para atualizar propriedades específicas do Profissional
  updateEspecialidade(especialidade: string): void {
    this._props.especialidade = especialidade;
    this._props.dataAtualizacao = new Date();
  }

  updateBiografia(biografia: string): void {
    this._props.biografia = biografia;
    this._props.dataAtualizacao = new Date();
  }

  adicionarHorarioDisponivel(horario: string): void {
    if (!this._props.horariosDisponiveis) {
      this._props.horariosDisponiveis = [];
    }
    this._props.horariosDisponiveis.push(horario);
    this._props.dataAtualizacao = new Date();
  }

  removerHorarioDisponivel(horario: string): void {
    if (this._props.horariosDisponiveis) {
      this._props.horariosDisponiveis = this._props.horariosDisponiveis.filter(h => h !== horario);
      this._props.dataAtualizacao = new Date();
    }
  }

  // Sobrescreve o método toJSON para incluir as propriedades específicas de Profissional
  toJSON() {
    return {
      ...super.toJSON(),
      crm: this.crm,
      especialidade: this.especialidade,
      biografia: this.biografia,
      horariosDisponiveis: this.horariosDisponiveis
    };
  }
}