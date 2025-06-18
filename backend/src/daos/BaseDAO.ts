/**
 * Interface base para Data Access Objects
 * Define operações comuns de CRUD que todos os DAOs devem implementar
 * 
 * @template T Tipo do modelo de dados
 */
export interface BaseDAO<T> {
  /**
   * Encontra um registro pelo ID
   * @param id ID do registro
   * @returns Registro encontrado ou null
   */
  findById(id: string): Promise<T | null>;
  
  /**
   * Encontra todos os registros
   * @returns Array de registros
   */
  findAll(): Promise<T[]>;
  
  /**
   * Cria um novo registro
   * @param data Dados para criar o registro
   * @returns Registro criado
   */
  create(data: any): Promise<T>;
  
  /**
   * Atualiza um registro existente
   * @param id ID do registro
   * @param data Dados para atualização
   * @returns Registro atualizado ou null se não encontrado
   */
  update(id: string, data: Partial<T>): Promise<T | null>;
  
  /**
   * Remove um registro
   * @param id ID do registro
   * @returns true se removido com sucesso, false caso contrário
   */
  delete(id: string): Promise<boolean>;
}
