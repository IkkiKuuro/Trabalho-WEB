import { UserRole } from "../../shared/types/common";
import { User } from "./User";

export interface Paciente extends User {
  id: string;
  nome: string;
  email: string;
  passwordHash: string; // Armazenar o hash da senha
  tipo: UserRole.PACIENTE;
  data_nascimento: Date;
  cpf: string; // Deve ser validado para garantir que é único
  contato_emergencia?: string; // Opcional, pode ser usado para armazenar o contato de emergência do paciente
}