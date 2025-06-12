// Constantes do sistema
export enum UserRole {
  PACIENTE = 'PACIENTE',
  PROFISSIONAL = 'PROFISSIONAL',
  ADMIN = 'ADMIN'
}

export enum TaskStatus {
  PENDENTE = 'PENDENTE',
  CONCLUIDA = 'CONCLUIDA',
  ATRASADA = 'ATRASADA'
}

export const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret';
export const JWT_EXPIRY = '1d'; // Token válido por 1 dia

export const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/saude-mental';

export const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
};

export const APP_PORT = parseInt(process.env.PORT || '3000');
