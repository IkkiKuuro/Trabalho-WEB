/**
 * Interface que define os serviços de autenticação
 * Define métodos para hash de senha, comparação, geração e verificação de token
 */
export interface AuthService {
  /**
   * Gera um hash para a senha fornecida
   * @param password Senha em texto puro
   * @returns Hash da senha
   */
  hashPassword(password: string): Promise<string>;
  
  /**
   * Compara uma senha em texto puro com um hash
   * @param password Senha em texto puro
   * @param hashedPassword Hash armazenado
   * @returns Booleano indicando se a senha é válida
   */
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  
  /**
   * Gera um token JWT para o usuário
   * @param userId ID do usuário
   * @param userRole Papel/Tipo do usuário (PACIENTE, PROFISSIONAL, ADMIN)
   * @returns Token JWT
   */
  generateToken(userId: string, userRole: string): string;
  
  /**
   * Verifica se um token JWT é válido
   * @param token Token JWT
   * @returns Dados do usuário contidos no token ou null se inválido
   */
  verifyToken(token: string): { userId: string; userRole: string } | null;
}
