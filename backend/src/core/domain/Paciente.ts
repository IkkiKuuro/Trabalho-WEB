import { UserRole } from "../../shared/types/common";
import { User } from "./User";

export interface Paciente extends User {
  tipo: UserRole.PACIENTE;
  data_nascimento: Date;
  cpf: string; 
  contato_emergencia?: string; 
}

export interface PacienteHashDeSenha extends Paciente {
    hash_de_senha: string;
}