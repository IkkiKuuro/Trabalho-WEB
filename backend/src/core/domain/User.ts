import { UserRole } from '../../shared/types/common';

export type UserProps = {
  id: string;
  nome: string;
  email: string;
  password: string;
  tipo: UserRole;
  dataCadastro: Date;
  dataAtualizacao: Date;
};

export class User {
  constructor(private readonly props: UserProps) {}

  // Getters para acessar as propriedades do usuário
  get id(): string {
    return this.props.id;
  }

  get nome(): string {
    return this.props.nome;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get tipo(): UserRole {
    return this.props.tipo;
  }

  get dataCadastro(): Date {
    return this.props.dataCadastro;
  }

  get dataAtualizacao(): Date {
    return this.props.dataAtualizacao;
  }

  // Métodos para atualizar as propriedades
  updateNome(nome: string): void {
    this.props.nome = nome;
    this.props.dataAtualizacao = new Date();
  }

  updateEmail(email: string): void {
    this.props.email = email;
    this.props.dataAtualizacao = new Date();
  }

  updatePassword(password: string): void {
    this.props.password = password;
    this.props.dataAtualizacao = new Date();
  }

  // Método para transformar o objeto em um formato mais simples
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      tipo: this.tipo,
      dataCadastro: this.dataCadastro,
      dataAtualizacao: this.dataAtualizacao
      // Note que a senha não é incluída por motivos de segurança
    };
  }
}