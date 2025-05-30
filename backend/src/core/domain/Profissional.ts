import { User } from "./User";
import { UserRole } from "../../shared/types/common";

export interface Profissional extends User {
  tipo: UserRole.PROFISSIONAL;
  id: string;
  crm: string;// Deve ser validado para garantir que é único
  especialidade: string;
}

export interface ProfissionalHashDeSenha extends Profissional {//issso e um metodo de seguransa da senha
  passwordHash: string;
}