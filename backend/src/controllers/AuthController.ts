// Authentication controller
import { Request, Response } from 'express';
import { LoginUserDTO } from '../dtos/auth/LoginUserDTO';
import { RegisterUserDTO } from '../dtos/auth/RegisterUserDTO';
import { UserResponseDTO } from '../dtos/auth/UserResponseDTO';
import { MongoUserDAO } from '../daos/impl/MongoUserDAO';
import { BcryptJwtAuthService } from '../services/impl/BcryptJwtAuthService';
import { User } from '../models/User';
import { Paciente } from '../models/Paciente';
import { Profissional } from '../models/Profissional';
import { UserRole } from '../utils/constants';
import { AppError, ValidationError } from '../utils/AppError';
import logger from '../utils/logger';

export class AuthController {
  private userDAO: MongoUserDAO;
  private authService: BcryptJwtAuthService;
  
  constructor() {
    this.userDAO = new MongoUserDAO();
    this.authService = new BcryptJwtAuthService();
  }
  
  /**
   * Login de usuário
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const loginDTO = new LoginUserDTO({ email, password });
      
      // Verifica se o email existe
      const user = await this.userDAO.findByEmailWithPassword(email);
      
      if (!user) {
        throw new AppError('Email ou senha inválidos', 401);
      }
      
      // Verifica a senha
      const isPasswordValid = await this.authService.comparePassword(
        password, 
        user.password
      );
      
      if (!isPasswordValid) {
        throw new AppError('Email ou senha inválidos', 401);
      }
      
      // Gera o token JWT
      const token = this.authService.generateToken(user.id, user.tipo);
      
      // Prepara a resposta
      let userResponse: UserResponseDTO;
      
      if (user.tipo === UserRole.PACIENTE) {
        const paciente = await this.userDAO.findPacienteById(user.id);
        userResponse = new UserResponseDTO({
          id: paciente.id,
          nome: paciente.nome,
          email: paciente.email,
          tipo: paciente.tipo,
          token,
          dataNascimento: paciente.dataNascimento,
          cpf: paciente.cpf
        });
      } else if (user.tipo === UserRole.PROFISSIONAL) {
        const profissional = await this.userDAO.findProfissionalById(user.id);
        userResponse = new UserResponseDTO({
          id: profissional.id,
          nome: profissional.nome,
          email: profissional.email,
          tipo: profissional.tipo,
          token,
          crm: profissional.crm,
          especialidade: profissional.especialidade
        });
      } else {
        userResponse = new UserResponseDTO({
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
          token
        });
      }
      
      return res.status(200).json(userResponse);
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
  
  /**
   * Registro de novo usuário
   */
  async register(req: Request, res: Response) {
    try {
      const registerDTO = new RegisterUserDTO(req.body);
      
      // Validação dos dados
      const validationErrors = registerDTO.validate();
      if (validationErrors.length > 0) {
        throw ValidationError(validationErrors.join(', '));
      }
      
      // Verifica se o email já existe
      const existingUser = await this.userDAO.findByEmail(registerDTO.email);
      if (existingUser) {
        throw ValidationError('Este email já está em uso');
      }
      
      // Criação de usuário baseado no tipo
      let newUser;
      
      if (registerDTO.tipo === UserRole.PACIENTE) {
        // Verifica dados específicos de paciente
        if (!registerDTO.dataNascimento || !registerDTO.cpf) {
          throw ValidationError('Data de nascimento e CPF são obrigatórios para pacientes');
        }
        
        const paciente = new Paciente({
          nome: registerDTO.nome,
          email: registerDTO.email,
          password: registerDTO.password,
          dataNascimento: registerDTO.dataNascimento,
          cpf: registerDTO.cpf,
          contatoEmergencia: registerDTO.contatoEmergencia
        });
        
        newUser = await this.userDAO.createPaciente(paciente);
      } else if (registerDTO.tipo === UserRole.PROFISSIONAL) {
        // Verifica dados específicos de profissional
        if (!registerDTO.crm || !registerDTO.especialidade) {
          throw ValidationError('CRM e especialidade são obrigatórios para profissionais');
        }
        
        // Verifica se o CRM já existe
        const existingProfissional = await this.userDAO.findProfissionalByCRM(registerDTO.crm);
        if (existingProfissional) {
          throw ValidationError('Este CRM já está registrado no sistema');
        }
        
        const profissional = new Profissional({
          nome: registerDTO.nome,
          email: registerDTO.email,
          password: registerDTO.password,
          crm: registerDTO.crm,
          especialidade: registerDTO.especialidade
        });
        
        newUser = await this.userDAO.createProfissional(profissional);
      } else {
        // Usuário admin ou outros tipos
        const user = new User({
          nome: registerDTO.nome,
          email: registerDTO.email,
          password: registerDTO.password,
          tipo: registerDTO.tipo
        });
        
        newUser = await this.userDAO.create(user);
      }
      
      // Gera o token JWT
      const token = this.authService.generateToken(newUser.id, newUser.tipo);
      
      // Prepara a resposta
      const userResponse = new UserResponseDTO({
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        tipo: newUser.tipo,
        token
      });
      
      return res.status(201).json(userResponse);
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}
