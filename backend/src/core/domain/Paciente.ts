import { UserRole } from "../../shared/types/common";
import { User, UserProps } from "./User";

export type PacienteProps = UserProps & {
  tipo: UserRole.PACIENTE;
  dataNascimento: Date;
  cpf: string;
  contatoEmergencia?: string;
  historico?: string;
};

export class Paciente extends User {
  private readonly _props: PacienteProps;

  constructor(props: PacienteProps) {
    super(props);
    this._props = props;
  }

  get dataNascimento(): Date {
    return this._props.dataNascimento;
  }

  get cpf(): string {
    return this._props.cpf;
  }

  get contatoEmergencia(): string | undefined {
    return this._props.contatoEmergencia;
  }

  get historico(): string | undefined {
    return this._props.historico;
  }

  // Métodos para atualizar propriedades específicas do Paciente
  updateContatoEmergencia(contato: string): void {
    this._props.contatoEmergencia = contato;
    this._props.dataAtualizacao = new Date();
  }

  adicionarHistorico(informacao: string): void {
    const historicoAtual = this._props.historico || '';
    const data = new Date().toISOString();
    this._props.historico = `${historicoAtual}\n[${data}] ${informacao}`;
    this._props.dataAtualizacao = new Date();
  }

  // Sobrescreve o método toJSON para incluir as propriedades específicas de Paciente
  toJSON() {
    return {
      ...super.toJSON(),
      dataNascimento: this.dataNascimento,
      cpf: this.cpf,
      contatoEmergencia: this.contatoEmergencia,
      historico: this.historico,
    };
  }
}