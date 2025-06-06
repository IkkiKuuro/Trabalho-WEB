import winston from 'winston';

// Configuração personalizada para o formato de logs
const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} ${level}: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
  }`;
});

// Criando o logger com configurações específicas
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Logs serão impressos no console
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
    // Logs serão gravados em arquivos
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

// Adicionando funções de utilidade específicas
export default {
  info: (message: string, meta = {}) => logger.info(message, meta),
  error: (message: string, error?: any) => {
    if (error instanceof Error) {
      logger.error(message, { 
        error: error.message, 
        stack: error.stack,
        ...(error as any)
      });
    } else {
      logger.error(message, { error });
    }
  },
  warn: (message: string, meta = {}) => logger.warn(message, meta),
  debug: (message: string, meta = {}) => logger.debug(message, meta),
  http: (message: string, meta = {}) => logger.http(message, meta),
};