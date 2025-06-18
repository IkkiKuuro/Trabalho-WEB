/**
 * Factory para criar instâncias com injeção de dependência
 * Centraliza a criação de objetos e suas dependências
 */

import { AuthController } from '../controllers/AuthController';
import { MongoUserDAO } from '../daos/impl/MongoUserDAO';
import { BcryptJwtAuthService } from '../services/impl/BcryptJwtAuthService';
import { PacienteController } from '../controllers/PacienteController';
import { ProfissionalController } from '../controllers/ProfissionalController';
import { UserController } from '../controllers/UserController';

/**
 * Factory para criar controladores e suas dependências
 */
export class ControllerFactory {
  /**
   * Cria uma instância de AuthController com suas dependências
   * @returns Instância de AuthController
   */
  static createAuthController(): AuthController {
    const userDAO = new MongoUserDAO();
    const authService = new BcryptJwtAuthService();
    
    return new AuthController(userDAO, authService);
  }
  
  /**
   * Cria uma instância de PacienteController com suas dependências
   * @returns Instância de PacienteController
   */
  static createPacienteController(): PacienteController {
    // Aqui você pode injetar as dependências necessárias
    const userDAO = new MongoUserDAO();
    // Outros DAOs necessários
    
    return new PacienteController();
  }
  
  /**
   * Cria uma instância de ProfissionalController com suas dependências
   * @returns Instância de ProfissionalController
   */
  static createProfissionalController(): ProfissionalController {
    // Aqui você pode injetar as dependências necessárias
    const userDAO = new MongoUserDAO();
    // Outros DAOs necessários
    
    return new ProfissionalController();
  }
  
  /**
   * Cria uma instância de UserController com suas dependências
   * @returns Instância de UserController
   */
  static createUserController(): UserController {
    // Aqui você pode injetar as dependências necessárias
    const userDAO = new MongoUserDAO();
    // Outros DAOs necessários
    
    return new UserController();
  }
}
